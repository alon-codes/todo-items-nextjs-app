import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { RecoilRoot } from 'recoil';

export default function App({ Component, pageProps }: AppProps) {
  
  return (
    <RecoilRoot>
      <DndProvider backend={HTML5Backend}>
        <Component {...pageProps} />
      </DndProvider>
      
    </RecoilRoot>
  );
}
