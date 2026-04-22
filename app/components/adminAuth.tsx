import { getSession } from 'next-auth/react';

type AdminSessionUser = {
  username?: string;
};

type AdminContext = Record<string, unknown>;

export default function withAdminAuth(Component: React.ComponentType<AdminContext>) {
  return async function AdminAuthComponent(context: AdminContext) {
    const session = await getSession(context);
    const user = session?.user as AdminSessionUser | undefined;
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
