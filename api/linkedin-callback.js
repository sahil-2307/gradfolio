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

    // Fetch comprehensive LinkedIn profile data
    const profileData = await fetchLinkedInProfileData(accessToken);
    console.log('LinkedIn profile fetched:', { 
      fullProfileData: JSON.stringify(profileData, null, 2)
    });

    // Transform LinkedIn data to our portfolio format
    const portfolioData = transformLinkedInData(profileData);

    console.log('LinkedIn data transformation complete:', {
      username: username,
      originalProfileData: JSON.stringify(profileData, null, 2),
      transformedPortfolioData: JSON.stringify(portfolioData, null, 2)
    });

    // Store the LinkedIn data for later use instead of redirecting to admin.html
    // We'll pass it as a query parameter to the callback page which will handle storage
    const callbackUrl = `/dashboard/linkedin-callback?success=true&username=${username}&linkedinData=${encodeURIComponent(JSON.stringify(portfolioData))}`;
    
    console.log('Redirecting to callback URL:', callbackUrl);
    res.redirect(callbackUrl);

  } catch (error) {
    console.error('LinkedIn callback error:', error);
    res.redirect(`/dashboard?error=callback_error&message=${encodeURIComponent(error.message)}`);
  }
}

// Comprehensive LinkedIn profile data fetching function
async function fetchLinkedInProfileData(accessToken) {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  };

  try {
    console.log('Fetching comprehensive LinkedIn profile data...');
    
    // Fetch basic profile information
    const [profileResponse, emailResponse] = await Promise.all([
      fetch('https://api.linkedin.com/v2/people/~:(id,firstName,lastName,profilePicture(displayImage~:playableStreams),headline,summary,industryName,location)', {
        headers
      }),
      fetch('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
        headers
      })
    ]);

    if (!profileResponse.ok) {
      throw new Error(`Profile fetch failed: ${profileResponse.status}`);
    }

    const profile = await profileResponse.json();
    let email = '';
    
    try {
      if (emailResponse.ok) {
        const emailData = await emailResponse.json();
        email = emailData.elements?.[0]?.['handle~']?.emailAddress || '';
      }
    } catch (emailError) {
      console.log('Email fetch failed, continuing without email:', emailError.message);
    }

    // Try to fetch positions (experience)
    let positions = [];
    try {
      const positionsResponse = await fetch('https://api.linkedin.com/v2/people/~/positions?count=20&start=0', {
        headers
      });
      if (positionsResponse.ok) {
        const positionsData = await positionsResponse.json();
        positions = positionsData.elements || [];
      }
    } catch (posError) {
      console.log('Positions fetch failed, using basic data:', posError.message);
    }

    // Try to fetch educations
    let educations = [];
    try {
      const educationsResponse = await fetch('https://api.linkedin.com/v2/people/~/educations?count=10&start=0', {
        headers
      });
      if (educationsResponse.ok) {
        const educationsData = await educationsResponse.json();
        educations = educationsData.elements || [];
      }
    } catch (eduError) {
      console.log('Educations fetch failed, using basic data:', eduError.message);
    }

    // Try to fetch skills
    let skills = [];
    try {
      const skillsResponse = await fetch('https://api.linkedin.com/v2/people/~/skills?count=50&start=0', {
        headers
      });
      if (skillsResponse.ok) {
        const skillsData = await skillsResponse.json();
        skills = skillsData.elements || [];
      }
    } catch (skillError) {
      console.log('Skills fetch failed, using basic data:', skillError.message);
    }

    return {
      profile,
      email,
      positions,
      educations,
      skills
    };

  } catch (error) {
    console.error('Error fetching LinkedIn data:', error);
    // Return basic structure to prevent complete failure
    return {
      profile: profileData || {},
      email: '',
      positions: [],
      educations: [],
      skills: []
    };
  }
}

function transformLinkedInData(linkedInData) {
  const { profile, email, positions, educations, skills } = linkedInData;

  // Extract basic info
  const firstName = profile.firstName?.localized?.en_US || profile.firstName?.preferredLocale?.language || '';
  const lastName = profile.lastName?.localized?.en_US || profile.lastName?.preferredLocale?.language || '';
  const fullName = `${firstName} ${lastName}`.trim() || 'LinkedIn Professional';
  
  const headline = profile.headline || 'Professional';
  const summary = profile.summary || '';
  const location = profile.location?.name || '';
  
  // Extract profile picture
  let profilePicture = '';
  if (profile.profilePicture?.displayImage) {
    const images = profile.profilePicture.displayImage.elements || [];
    if (images.length > 0) {
      profilePicture = images[0].identifiers?.[0]?.identifier || '';
    }
  }

  // Transform positions to experience
  const experience = positions.map((pos) => {
    const company = pos.companyName || 'Company';
    const position = pos.title || 'Position';
    
    // Format dates
    const startDate = pos.dateRange?.start ? `${pos.dateRange.start.month || '01'}/${pos.dateRange.start.year}` : '';
    const endDate = pos.dateRange?.end ? `${pos.dateRange.end.month || '12'}/${pos.dateRange.end.year}` : 'Present';
    const duration = startDate ? `${startDate} - ${endDate}` : 'Date not specified';
    
    const description = pos.description || `Professional role at ${company} with responsibilities in ${position}.`;
    
    return {
      position,
      company,
      duration,
      description
    };
  });

  // Transform educations
  const education = educations.map((edu) => {
    const institution = edu.schoolName || 'Educational Institution';
    const degree = edu.degreeName || edu.fieldOfStudy || 'Degree';
    const year = edu.dateRange?.end?.year || edu.dateRange?.start?.year || new Date().getFullYear();
    const description = edu.description || `${degree} from ${institution}`;
    
    return {
      degree,
      institution,
      year: year.toString(),
      description
    };
  });

  // Transform skills
  const technicalSkills = skills.slice(0, 10).map(skill => 
    skill.name?.localized?.en_US || skill.name || 'Skill'
  );
  
  // Add some default soft skills based on headline and summary
  const softSkills = [
    'Communication',
    'Leadership', 
    'Problem Solving',
    'Team Collaboration',
    'Critical Thinking'
  ];

  // Transform to projects (use a default project based on experience)
  const projects = experience.length > 0 ? [{
    title: `${experience[0].position} Project`,
    description: `Professional project during tenure at ${experience[0].company}. ${experience[0].description.substring(0, 100)}...`,
    technologies: technicalSkills.slice(0, 3),
    link: ''
  }] : [{
    title: 'Professional Portfolio',
    description: 'Comprehensive showcase of professional experience and achievements',
    technologies: ['Professional Development'],
    link: ''
  }];

  // Generate achievements from LinkedIn data
  const achievements = [
    'LinkedIn verified professional profile',
    ...(experience.length > 0 ? [`Professional experience at ${experience[0].company}`] : []),
    ...(education.length > 0 ? [`${education[0].degree} graduate`] : []),
    ...(skills.length > 0 ? [`Expertise in ${skills.length} professional skills`] : []),
    'Active professional network member'
  ].slice(0, 5); // Limit to 5 achievements

  return {
    personal: {
      fullName,
      email: email || '',
      phone: '',
      linkedin: `https://linkedin.com/in/${profile.id || 'profile'}`,
      github: '',
      website: ''
    },
    about: {
      paragraph1: summary || `${headline}. Experienced professional with a proven track record of success.`,
      paragraph2: location ? `Based in ${location}. ` : '' + 'Committed to delivering high-quality results and building meaningful professional relationships.'
    },
    experience: experience.length > 0 ? experience : [{
      position: headline || 'Professional',
      company: 'LinkedIn Member',
      duration: '2020 - Present',
      description: summary || 'Experienced professional with diverse expertise and a strong commitment to excellence in all endeavors.'
    }],
    education: education.length > 0 ? education : [{
      degree: 'Professional Development',
      institution: 'Continuous Learning',
      year: new Date().getFullYear().toString(),
      description: 'Ongoing professional development and skill enhancement through various channels and experiences.'
    }],
    skills: {
      technical: technicalSkills.length > 0 ? technicalSkills : ['Leadership', 'Communication', 'Strategy', 'Project Management', 'Problem Solving'],
      soft: softSkills
    },
    projects,
    achievements
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