# Profile Picture Debugging Guide

## Overview
This guide helps debug why profile pictures aren't showing up in production.

## What Was Added

### 1. Console Logging
- **Layout**: Session retrieval and user data logging
- **Profile Page**: Session data, user object, and environment variable checks
- **UserProfile Component**: Component mounting and user data logging
- **Auth0 Config**: Environment variable validation

### 2. Visual Debug Information
- **Profile Page**: Debug section showing user data, tokens, and session info
- **DebugInfo Component**: Floating debug panel accessible from any page
- **Error Handling**: Graceful fallbacks when session retrieval fails

### 3. Image Loading Debug
- **onLoad/onError**: Image loading success/failure logging
- **URL Display**: Picture URLs shown for verification

## How to Use

### 1. Check Browser Console
Open browser console and look for logs starting with:
- `Layout -` - Session retrieval process
- `Profile page -` - Profile page specific data
- `UserProfile -` - Navbar user profile data
- `Auth0 -` - Auth0 configuration status

### 2. Use Debug Panel
- Click the 🐛 button (bottom-right corner) on any page
- Review session data, cookies, and storage information
- Use "Log to Console" to see all debug data

### 3. Check Profile Page
- Navigate to `/profile`
- Look for debug information section
- Verify picture URL is displayed
- Check if image loads or shows error

## Common Issues to Check

### 1. Environment Variables
Ensure these are set in production:
- `AUTH0_DOMAIN`
- `AUTH0_CLIENT_ID`
- `AUTH0_CLIENT_SECRET`
- `AUTH0_SECRET`
- `AUTH0_SCOPE`
- `AUTH0_AUDIENCE`

### 2. Auth0 Configuration
- Verify Auth0 application settings
- Check callback URLs
- Ensure profile scope includes picture
- Verify domain configuration

### 3. Session Management
- Check if sessions are being created
- Verify token expiration
- Look for authentication errors

### 4. Image Loading
- Verify picture URLs are accessible
- Check Next.js image domain configuration
- Look for CORS or network errors

## Debug Output Examples

### Successful Session
```
Layout - Session retrieval result: Success
Layout - User data available: {
  name: "John Doe",
  email: "john@example.com",
  picture: "https://lh3.googleusercontent.com/...",
  sub: "google-oauth2|123456789"
}
```

### Failed Session
```
Layout - Session retrieval result: Null
Layout - No user data in session
```

### Environment Issues
```
Auth0 - AUTH0_DOMAIN: Not set
Auth0 - AUTH0_CLIENT_ID: Not set
Auth0 - AUTH0_SECRET: Not set
```

## Next Steps After Debugging

1. **Fix Environment Variables** - Set missing Auth0 configuration
2. **Check Auth0 Dashboard** - Verify application settings
3. **Review Network Requests** - Check for failed API calls
4. **Verify Image URLs** - Ensure profile pictures are accessible
5. **Check CORS Settings** - Verify domain allowlists

## Removing Debug Code

After fixing the issue, remove:
- Console.log statements
- DebugInfo component
- Debug sections in profile page
- Error handling fallbacks

## Support

If issues persist after debugging:
1. Check Auth0 logs
2. Review production environment variables
3. Verify domain configuration
4. Check browser network tab for errors
