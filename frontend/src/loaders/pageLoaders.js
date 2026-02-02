const API_URL = import.meta.env.VITE_API_URL;

// Loader for Home page
export async function homeLoader() {
  try {
    const res = await fetch(`${API_URL}/public/page/home`);
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        return data.data;
      }
    }
  } catch (err) {
    console.error('Failed to fetch home page data:', err);
  }
  return null;
}

// Loader for About page
export async function aboutLoader() {
  try {
    const res = await fetch(`${API_URL}/public/page/about`);
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        return data.data;
      }
    }
  } catch (err) {
    console.error('Failed to fetch about page data:', err);
  }
  return null;
}

// Loader for Dynamic pages
export async function dynamicPageLoader({ params }) {
  const { slug } = params;
  try {
    const res = await fetch(`${API_URL}/public/page/${slug}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        return data.data;
      }
    }
  } catch (err) {
    console.error('Failed to fetch page data:', err);
  }
  return null;
}

// Loader for Navbar
export async function navbarLoader() {
  try {
    const [settingsRes, navbarRes] = await Promise.all([
      fetch(`${API_URL}/settings`),
      fetch(`${API_URL}/public/navbar`)
    ]);

    const settings = settingsRes.ok ? await settingsRes.json() : null;
    const navbar = navbarRes.ok ? await navbarRes.json() : null;

    return {
      settings: settings?.data || {},
      links: navbar?.success && navbar.data?.length > 0 
        ? navbar.data.map(page => ({
            name: page.title,
            href: page.isCustomLink ? page.link : `/${page.slug === 'home' ? '' : page.slug}`
          }))
        : [
            { name: 'Home', href: '/' },
            { name: 'About US', href: '/about' },
            { name: 'Doctors', href: '/doctors' },
            { name: 'Specialities', href: '/specialties' },
            { name: 'Blogs', href: '/blogs' },
            { name: 'Contact', href: '/contact' },
          ]
    };
  } catch (err) {
    console.error('Failed to fetch navbar data:', err);
    return {
      settings: {},
      links: [
        { name: 'Home', href: '/' },
        { name: 'About US', href: '/about' },
        { name: 'Doctors', href: '/doctors' },
        { name: 'Specialities', href: '/specialties' },
        { name: 'Blogs', href: '/blogs' },
        { name: 'Contact', href: '/contact' },
      ]
    };
  }
}

// Loader for Footer settings
export async function footerLoader() {
  try {
    const res = await fetch(`${API_URL}/settings`);
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        return data.data;
      }
    }
  } catch (err) {
    console.error('Failed to fetch footer settings:', err);
  }
  return {};
}
