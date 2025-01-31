import { CoinbaseWallet } from "@thirdweb-dev/wallets";
import {
  ConfiguredWallet,
  useCreateWalletInstance,
  useWalletContext,
} from "@thirdweb-dev/react-core";
import { useEffect, useRef, useState } from "react";
import { ScanScreen } from "../../ConnectWallet/screens/ScanScreen";

export const CoinbaseScan: React.FC<{
  onBack: () => void;
  onGetStarted: () => void;
  onConnected: () => void;
  configuredWallet: ConfiguredWallet;
}> = ({ configuredWallet, onConnected, onGetStarted, onBack }) => {
  const createInstance = useCreateWalletInstance();
  const [qrCodeUri, setQrCodeUri] = useState<string | undefined>(undefined);
  const { setConnectedWallet, chainToConnect } = useWalletContext();

  const scanStarted = useRef(false);

  useEffect(() => {
    if (scanStarted.current) {
      return;
    }

    scanStarted.current = true;

    (async () => {
      const wallet = createInstance(configuredWallet) as InstanceType<
        typeof CoinbaseWallet
      >;

      const uri = await wallet.getQrUrl();
      setQrCodeUri(uri || undefined);

      await wallet.connect({
        chainId: chainToConnect?.chainId,
      });

      setConnectedWallet(wallet);
      onConnected();
    })();
  }, [
    createInstance,
    onConnected,
    configuredWallet,
    chainToConnect?.chainId,
    setConnectedWallet,
  ]);

  return (
    <ScanScreen
      onBack={onBack}
      onGetStarted={onGetStarted}
      qrCodeUri={qrCodeUri}
      walletName={configuredWallet.meta.name}
      walletIconURL={configuredWallet.meta.iconURL}
    />
  );
};
