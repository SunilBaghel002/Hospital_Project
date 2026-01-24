const API_BASE = import.meta.env.VITE_API_URL;

// Get stored token
const getToken = () => localStorage.getItem('adminToken');

// Set token
const setToken = (token) => localStorage.setItem('adminToken', token);

// Remove token
const removeToken = () => localStorage.removeItem('adminToken');

// API request helper with auth
const apiRequest = async (endpoint, options = {}) => {
    const token = getToken();
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers
    });
    
    const data = await response.json();
    
    if (!response.ok) {
        // If unauthorized, clear token
        if (response.status === 401) {
            removeToken();
        }
        throw new Error(data.message || 'Request failed');
    }
    
    return data;
};

// Admin Authentication API
export const adminAuthAPI = {
    login: async (username, password) => {
        const response = await apiRequest('/admin/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
        
        if (response.success && response.data.token) {
            setToken(response.data.token);
        }
        
        return response;
    },
    
    verify: async () => {
        return apiRequest('/admin/verify');
    },
    
    logout: async () => {
        try {
            await apiRequest('/admin/logout', { method: 'POST' });
        } finally {
            removeToken();
        }
    },
    
    isAuthenticated: () => {
        return !!getToken();
    }
};

// Pages API
export const pagesAPI = {
    getAll: (type = null) => {
        const query = type ? `?type=${type}` : '';
        return apiRequest(`/pages${query}`);
    },
    
    getOne: (id) => apiRequest(`/pages/${id}`),
    
    create: (pageData) => apiRequest('/pages', {
        method: 'POST',
        body: JSON.stringify(pageData)
    }),
    
    update: (id, pageData) => apiRequest(`/pages/${id}`, {
        method: 'PUT',
        body: JSON.stringify(pageData)
    }),
    
    delete: (id) => apiRequest(`/pages/${id}`, {
        method: 'DELETE'
    }),
    
    reorderNavbar: (orderedIds) => apiRequest('/pages/reorder/navbar', {
        method: 'PUT',
        body: JSON.stringify({ orderedIds })
    })
};

// Sections API
export const sectionsAPI = {
    getByPage: (pageId) => apiRequest(`/sections/page/${pageId}`),
    
    getOne: (id) => apiRequest(`/sections/${id}`),
    
    create: (sectionData) => apiRequest('/sections', {
        method: 'POST',
        body: JSON.stringify(sectionData)
    }),
    
    update: (id, sectionData) => apiRequest(`/sections/${id}`, {
        method: 'PUT',
        body: JSON.stringify(sectionData)
    }),
    
    delete: (id) => apiRequest(`/sections/${id}`, {
        method: 'DELETE'
    }),
    
    reorder: (pageId, orderedIds) => apiRequest(`/sections/reorder/${pageId}`, {
        method: 'PUT',
        body: JSON.stringify({ orderedIds })
    }),
    
    toggleVisibility: (id) => apiRequest(`/sections/visibility/${id}`, {
        method: 'PUT'
    })
};

// Settings API
export const settingsAPI = {
    get: () => apiRequest('/settings'),
    
    update: (settings) => apiRequest('/settings', {
        method: 'PUT',
        body: JSON.stringify(settings)
    })
};

// Upload API (Cloudinary)
export const uploadAPI = {
    upload: async (file) => {
        const token = getToken();
        const formData = new FormData();
        formData.append('file', file);  // Changed from 'image' to 'file' for Cloudinary
        
        const response = await fetch(`${API_BASE}/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Upload failed');
        }
        
        return data;
    },
    
    uploadMultiple: async (files) => {
        const token = getToken();
        const formData = new FormData();
        
        files.forEach(file => {
            formData.append('files', file);  // Changed from 'images' to 'files'
        });
        
        const response = await fetch(`${API_BASE}/upload/multiple`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Upload failed');
        }
        
        return data;
    },
    
    list: () => apiRequest('/upload/list'),
    
    delete: (filename) => apiRequest(`/upload/${filename}`, {
        method: 'DELETE'
    }),
    
    // For uploads, we need the base without /api
    getUrl: (filename) => {
        const baseUrl = API_BASE.replace('/api', '');
        return `${baseUrl}/uploads/${filename}`;
    }
};

// Public API (for frontend dynamic content)
export const publicAPI = {
    getNavbar: () => apiRequest('/public/navbar'),
    getPage: (slug) => apiRequest(`/public/page/${slug}`),
    getSubpages: (parentSlug) => apiRequest(`/public/subpages/${parentSlug}`),
    getSettings: () => apiRequest('/settings')
};
