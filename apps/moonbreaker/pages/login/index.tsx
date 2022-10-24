import { signIn } from 'next-auth/react';
import { unstable_getServerSession } from 'next-auth/next';

import { authOptions } from '../api/auth/[...nextauth]';

import styles from './Login.module.scss';

import type { GetServerSidePropsContext } from 'next';

const Login = () => {
  const googleLogin = () => {
    signIn('google');
  };

  return (
    <section className={styles.container}>
      <h1 className={`${styles.heading} heading-1`}>Auth</h1>
      <p className={`${styles.flavorText} text`}>Please login or sign up in.</p>
      <button className={styles.button} onClick={googleLogin}>
        Google auth provider
      </button>
    </section>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (session) {
    return {
      redirect: {
        destination: '/add-roster',
        permanent: false,
      },
    };
  }

  return { props: {} };
}

export default Login;
