export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    console.log('LinkedIn callback received:', {
      method: req.method,
      url: req.url,
      query: req.query,
      headers: {
        origin: req.headers.origin,
        referer: req.headers.referer,
        userAgent: req.headers['user-agent']
      }
    });

    const { code, state, error } = req.query;

    if (error) {
      console.error('LinkedIn OAuth error:', error);
      return res.redirect(`/dashboard?error=linkedin_auth_failed&message=${encodeURIComponent(error)}`);
    }

    if (!code || !state) {
      return res.redirect('/dashboard?error=missing_parameters');
    }

    // Parse state to get user info
    let userInfo;
    try {
      userInfo = JSON.parse(decodeURIComponent(state));
    } catch (parseError) {
      console.error('State parsing error:', parseError);
      return res.redirect('/dashboard?error=invalid_state');
    }

    const { userId, username } = userInfo;
    if (!userId || !username) {
      return res.redirect('/dashboard?error=invalid_user_info');
    }

    // Exchange code for access token
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
    const redirectUri = `${req.headers.origin || 'https://onlineportfolios.in'}/api/linkedin-callback`;

    console.log('LinkedIn credentials check:', {
      clientId: clientId ? `${clientId.substring(0, 10)}...` : 'MISSING',
      clientSecret: clientSecret ? 'CONFIGURED' : 'MISSING',
      redirectUri,
      origin: req.headers.origin,
      host: req.headers.host
    });

    if (!clientId || !clientSecret) {
      console.error('LinkedIn credentials not configured on backend');
      return res.redirect('/dashboard?error=linkedin_backend_not_configured&message=Backend LinkedIn credentials missing');
    }

    console.log('Exchanging LinkedIn code for access token:', { code: code.substring(0, 10) + '...', userId, username });

    // Get access token
    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret
      })
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('LinkedIn token exchange failed:', {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        error: errorData
      });
      return res.redirect('/dashboard?error=token_exchange_failed');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    console.log('LinkedIn access token received');

    // Fetch LinkedIn profile
    const profileResponse = await fetch('https://api.linkedin.com/v2/people/~:(id,firstName,lastName,headline,summary,positions)', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0'
      }
    });

    if (!profileResponse.ok) {
      const errorData = await profileResponse.text();
      console.error('LinkedIn profile fetch failed:', {
        status: profileResponse.status,
        error: errorData
      });
      return res.redirect('/dashboard?error=profile_fetch_failed');
    }

    const profileData = await profileResponse.json();
    console.log('LinkedIn profile fetched:', { 
      id: profileData.id,
      fullProfileData: JSON.stringify(profileData, null, 2)
    });

    // Fetch email address
    const emailResponse = await fetch('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0'
      }
    });

    let email = '';
    if (emailResponse.ok) {
      const emailData = await emailResponse.json();
      email = emailData.elements?.[0]?.['handle~']?.emailAddress || '';
      console.log('LinkedIn email fetched:', email);
    } else {
      console.log('LinkedIn email fetch failed:', emailResponse.status, await emailResponse.text());
    }

    // Transform LinkedIn data to our portfolio format
    const portfolioData = transformLinkedInData(profileData, email);

    console.log('LinkedIn data transformed for user:', username);
    console.log('Transformed portfolio data:', JSON.stringify(portfolioData, null, 2));

    // Store the LinkedIn data for later use instead of redirecting to admin.html
    // We'll pass it as a query parameter to the callback page which will handle storage
    const callbackUrl = `/dashboard/linkedin-callback?success=true&username=${username}&linkedinData=${encodeURIComponent(JSON.stringify(portfolioData))}`;
    
    res.redirect(callbackUrl);

  } catch (error) {
    console.error('LinkedIn callback error:', error);
    res.redirect(`/dashboard?error=callback_error&message=${encodeURIComponent(error.message)}`);
  }
}

function transformLinkedInData(profileData, email) {
  const firstName = profileData.firstName?.localized?.en_US || '';
  const lastName = profileData.lastName?.localized?.en_US || '';
  const fullName = `${firstName} ${lastName}`.trim();

  const headline = profileData.headline || '';
  const summary = profileData.summary || '';

  // Transform positions to experience format
  const experience = (profileData.positions?.values || []).map(position => ({
    position: position.title || 'Position',
    company: position.company?.name || 'Company',
    duration: formatLinkedInDate(position.startDate, position.endDate),
    description: position.summary || 'Professional experience at ' + (position.company?.name || 'the company')
  }));

  return {
    personal: {
      fullName: fullName || 'Professional',
      email: email,
      phone: '',
      linkedin: `https://linkedin.com/in/${profileData.id}`,
      github: '',
      website: ''
    },
    about: {
      paragraph1: summary || headline || 'Experienced professional with a passion for excellence and innovation.',
      paragraph2: 'Committed to delivering high-quality results and building meaningful professional relationships.'
    },
    experience: experience.length > 0 ? experience.slice(0, 3) : [{
      position: headline || 'Professional',
      company: 'LinkedIn Profile',
      duration: '2020 - Present',
      description: 'Professional with diverse experience and expertise.'
    }],
    education: [{
      degree: 'Professional Background',
      institution: 'LinkedIn Profile',
      year: '2020',
      description: 'Continuous professional development and learning'
    }],
    skills: {
      technical: ['Leadership', 'Communication', 'Strategy', 'Management'],
      soft: ['Team Work', 'Problem Solving', 'Critical Thinking', 'Adaptability']
    },
    projects: [{
      title: 'Professional Portfolio',
      description: 'Comprehensive professional experience and achievements',
      technologies: ['Leadership', 'Management'],
      link: ''
    }],
    achievements: [
      'LinkedIn verified professional profile',
      'Established professional network',
      'Proven track record of professional growth'
    ]
  };
}

function formatLinkedInDate(startDate, endDate) {
  const formatDate = (date) => {
    if (!date) return '';
    const month = date.month ? String(date.month).padStart(2, '0') : '01';
    const year = date.year || new Date().getFullYear();
    return `${month}/${year}`;
  };

  const start = formatDate(startDate) || '2020';
  const end = endDate ? formatDate(endDate) : 'Present';
  
  return `${start} - ${end}`;
}