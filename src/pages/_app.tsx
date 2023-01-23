// eslint-disable-next-line no-restricted-imports
import "src/styles/globals.css";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import { ReactElement, ReactNode } from "react";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

import PublicLayout from "src/layout/PublicLayout";
import { useStore } from "src/store";

export type NextPageWithLayout<P> = NextPage<P> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout<NextPage>;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout =
    Component.getLayout ?? ((page) => <PublicLayout>{page}</PublicLayout>);

  const store = useStore(pageProps.initialReduxState);
  const persistor = persistStore(store, {}, function () {
    persistor.persist();
  });

  const children = getLayout(<Component {...pageProps} />);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={children}>
        {children}
      </PersistGate>
    </Provider>
  );
}

export default MyApp;
