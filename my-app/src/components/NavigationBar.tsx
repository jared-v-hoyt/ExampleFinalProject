import Link from 'next/link';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import { Typography } from '@mui/material';

type NavigationBarProps = {
  pages: Array<string>
}

export default function NavigationBar(props: NavigationBarProps) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Frontend Demonstration
            </Typography>

            <Box
              sx={{
                flexGrow: 1,
                display: {
                  xs: 'none',
                  md: 'flex'
                }
              }}
            >
              {props.pages.map((page) => {
                return (
                  <Link
                    key={page}
                    href={`/${page.toLowerCase()}`}
                  >
                    {page}
                  </Link>
                );
              })}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Toolbar />
    </Box>
  );
}