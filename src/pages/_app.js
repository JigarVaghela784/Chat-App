import '../styles/globals.css'
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

import PublicLayout from "../layout/PublicLayout";
import { useStore } from "../store";


function MyApp({ Component, pageProps }) {
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
