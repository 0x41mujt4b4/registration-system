import { getSession } from 'next-auth/react';

export default function withAdminAuth(Component) {
  return async function AdminAuthComponent(context) {
    const session = await getSession(context);
    console.log("with admin auth sesion: ", session.user.username);
    if (!session || session.user.username !== 'admin') {
      return {
        redirect: {
          destination: '/registration',
          permanent: true,
        },
      };
    }

    return <Component {...context} />;
  };
}
