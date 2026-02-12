/**
 * YakiHonne Simulator
 * 
 * A full-featured cross-platform Nostr client simulator with Bitcoin/Lightning integration.
 * Features include:
 * - Mixed content feed (posts, articles, media)
 * - Long-form article publishing
 * - Media gallery with photo/video grid
 * - Wallet with balance and transaction history
 * - Bitcoin orange theme (#F7931A)
 * - Content type switching
 * - Zap integration
 * 
 * @module simulators/yakihonne
 */

export { YakiHonneSimulator } from './YakiHonneSimulator';
export type { YakiHonneSimulatorProps, TabId } from './YakiHonneSimulator';

// Screens
export { FeedScreen } from './screens/FeedScreen';
export { ArticlesScreen } from './screens/ArticlesScreen';
export { MediaScreen } from './screens/MediaScreen';
export { ProfileScreen } from './screens/ProfileScreen';
export { WalletScreen } from './screens/WalletScreen';
export { SettingsScreen } from './screens/SettingsScreen';
export { ComposeScreen } from './screens/ComposeScreen';

// Components
export { ArticleCard } from './components/ArticleCard';
export { MediaGrid } from './components/MediaGrid';
export { WalletDisplay } from './components/WalletDisplay';
export { ContentTabs } from './components/ContentTabs';

// Theme
import './yakihonne.theme.css';
