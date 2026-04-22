import { getSession } from 'next-auth/react';

export default function withAdminAuth(Component: React.ComponentType<any>) {
  return async function AdminAuthComponent(context: any) {
    const session = await getSession(context);
    const user = session?.user as any;
    console.log("with admin auth session: ", user?.username);
    if (!session || user?.username !== 'admin') {
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
