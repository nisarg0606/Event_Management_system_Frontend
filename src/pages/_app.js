import "@/styles/globals.scss";

import { SessionProvider, useSession } from "next-auth/react";
import { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/router";
import { SnackbarProvider } from "notistack";

import Loading from "@/components/common/Loading"; //Shows a loader inbetween page renders
import getLayout from "@/layouts"; //Gets the layout based on the page

export default function MyApp({ Component, pageProps: pageProps, session }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleStop = () => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router]);

  const Layout = Component.Layout ? getLayout(Component.Layout) : getLayout();
  const Container = Component.auth ? Auth : Fragment;
  // const LayoutContainer = Layout.auth ? Auth : Fragment;

  return (
    <SessionProvider session={pageProps.session}>
      <SnackbarProvider
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        maxSnack={3}
        autoHideDuration={4000}
        preventDuplicate
      >
        {/* <LayoutContainer> */}
          <Layout {...Component.LayoutProps}>
            {loading ? (
              <Loading />
            ) : (
              <Container>
                <Component {...pageProps} />
              </Container>
            )}
          </Layout>
        {/* </LayoutContainer> */}
      </SnackbarProvider>
    </SessionProvider>
  );
}

function Auth({ children }) {
  const router = useRouter();
  const { data: session, status, token } = useSession();
  const isUser = !!session?.user;
  useEffect(() => {
    if (status === "loading") return;

    // Do nothing while loading
    if (!isUser) router.push("/"); //Redirect to Landing page
  }, [isUser, status]);

  if (isUser) {
    return children;
  }
}
