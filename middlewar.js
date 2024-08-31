// middleware.js
import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/',
  },
  secret: process.env.NEXTAUTH_SECRET, // Assurez-vous de définir cette variable d'environnement
});

export const config = {
  matcher: ['/dashboard', '/users', '/classes', '/student'], // Inclure toutes les routes que vous souhaitez protéger
};
