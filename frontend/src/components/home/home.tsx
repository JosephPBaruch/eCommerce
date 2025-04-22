import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import AppTheme from '../../theme/AppTheme';
import AppAppBar from '../shared/AppAppBar';
import MainContent from './MainContent';
import Footer from '../shared/Footer';

export default function HomePage(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBar />
      <Container
        maxWidth="lg"
        sx={{
          display: 'flex', flexDirection: 'column', my: 25, gap: 4,
        }}>
        <MainContent />
        <Footer />
      </Container>
    </AppTheme>
  );
}
