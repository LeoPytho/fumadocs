import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link'; // Changed from fumadocs-core/link to next/link for broader compatibility with MUI examples
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  SvgIcon,
} from '@mui/material';
import { styled } from '@mui/system';
import AddIcon from '@mui/icons-material/Add'; // MUI equivalent of PlusIcon

import { createMetadata } from '@/lib/metadata';
import Jeketian from './686103cd95e8ca13853ee2a9.jpg';
import Jkt48connect from './685ff7f8525d02566271d545.png';
import Design from './design.png';

export const metadata = createMetadata({
  title: 'Showcase',
  description: 'Some cool websites using jkt48connect',
  openGraph: {
    url: 'https://docs.jkt48connect.my.id/showcase',
  },
});

interface ShowcaseObject {
  image?: StaticImageData | string;
  name: string;
  url: string;
}

interface ProjectObject {
  name: string;
  description: string;
  category: string;
  url?: string;
  status: 'Active' | 'Maintenance' | 'Beta' | 'Deprecated';
  tech?: string[];
}

const showcases: ShowcaseObject[] = [
  {
    image: Jeketian,
    name: 'Jeketian',
    url: 'https://www.jeketian.web.id/',
  },
  {
    image: Jkt48connect,
    name: 'JKT48Connect',
    url: 'https://www.jkt48connect.my.id',
  },
];

const blogs: ShowcaseObject[] = [
  {
    name: 'ZENOVA WhatsApp Bot',
    url: 'https://wa.me/6285189020193',
  },
  {
    name: 'JKT48Connect Discord Bot',
    url: 'https://discord.com/oauth2/authorize?client_id=1305141693477027891',
  },
];

const projects: ProjectObject[] = [
  {
    name: 'JKT48Connect API',
    description:
      'RESTful API untuk mengakses data JKT48 termasuk member, jadwal, berita, dan konten multimedia',
    category: 'API',
    url: 'https://v2.jkt48connect.my.id',
    status: 'Active',
    tech: ['Node.js', 'Express', 'MongoDB'],
  },
  {
    name: 'JKT48Connect WEB',
    description:
      'web official sebagai contoh sekaligus application yang bisa digunakan untuk melihat atau bahkan menonton livestreaming member secara langsung.',
    category: 'Web App',
    url: 'https://www.jkt48connect.my.id',
    status: 'Active',
    tech: ['Next.js', 'React', 'TypeScript'],
  },
  {
    name: 'JKT48Connect Docs',
    description:
      'web dokumentasi official, untuk membantu developer dalam menggunakan JKT48Connect.',
    category: 'Web App',
    url: 'https://docs.jkt48connect.my.id',
    status: 'Active',
    tech: ['Next.js', 'React', 'TypeScript'],
  },
  {
    name: 'ZENOVA',
    description: 'Bot WhatsApp otomatis untuk mendapatkan informasi JKT48 secara real-time',
    category: 'Chatbot',
    url: 'https://wa.me/6285189020193',
    status: 'Active',
    tech: ['Node.js', 'WhatsApp Web.js'],
  },
  {
    name: 'JKT48Connect Discord Bot',
    description: 'Bot Discord dengan fitur notifikasi otomatis, games, dan integrasi API JKT48',
    category: 'Chatbot',
    url: 'https://discord.com/oauth2/authorize?client_id=1305141693477027891',
    status: 'Active',
    tech: ['Discord.js', 'Node.js'],
  },
  {
    name: '@jkt48/core',
    description: 'Software Development Kits untukmemudahkan dalam menggunakan jkt48connect',
    category: 'Package',
    status: 'Active',
    tech: ['Javascript', 'Express'],
  },
  {
    name: '@jkt48connect-corp/baileys',
    description: 'Baileys untuk WhatsApp yang dibekali dengan fitur button dan lainnya.',
    category: 'Package',
    status: 'Active',
    tech: ['Javascript', 'Express'],
  },
  {
    name: 'JKT48Connect SDKs',
    description:
      'Software Development Kits untuk berbagai bahasa pemrograman (JavaScript, Python, PHP)',
    category: 'Developer Tools',
    status: 'Deprecated',
    tech: ['JavaScript', 'Python', 'PHP'],
  },
];

const vercel = [
  {
    name: 'Turbo',
    url: 'https://turbo.build',
  },
  {
    name: 'Flags SDK',
    url: 'https://flags-sdk.dev',
  },
  {
    name: 'Chat SDK',
    url: 'https://chat-sdk.dev',
  },
];

const categories = Array.from(new Set(projects.map((project) => project.category)));

const getStatusColor = (status: ProjectObject['status']) => {
  switch (status) {
    case 'Active':
      return { bgcolor: 'success.light', color: 'success.contrastText' };
    case 'Beta':
      return { bgcolor: 'info.light', color: 'info.contrastText' };
    case 'Maintenance':
      return { bgcolor: 'warning.light', color: 'warning.contrastText' };
    case 'Deprecated':
      return { bgcolor: 'error.light', color: 'error.contrastText' };
    default:
      return { bgcolor: 'grey.300', color: 'text.primary' };
  }
};

// Styled components for custom elements that replicate original styling
const StyledShowcaseContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  border: '1px dashed',
  borderColor: theme.palette.divider,
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
}));

const StyledVercelSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  border: '1px dashed',
  borderColor: theme.palette.divider,
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
  alignItems: 'flex-start',
}));

const StyledShowcaseGrid = styled(Grid)(({ theme }) => ({
  position: 'relative',
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3), // Added to make space for "See website" link
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: theme.spacing(10), // Adjust height of gradient overlay
    background: `linear-gradient(to top, ${theme.palette.background.default}, transparent)`,
    zIndex: 1,
  },
}));

const StyledProjectCard = styled(Card)(({ theme }) => ({
  border: '1px dashed',
  borderColor: theme.palette.divider,
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export default function Showcase() {
  return (
    <Box
      sx={{
        px: { xs: 2, sm: 4 },
        py: { xs: 6, md: 12 },
        zIndex: 2,
        width: '100%',
        maxWidth: 1400,
        mx: 'auto',
      }}
    >
      <StyledShowcaseContainer>
        <Typography variant="h4" component="h1" sx={{ mb: 2, fontWeight: 'medium' }}>
          The restapi created for everyone.
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          A list of beautiful projects with their powered by JKT48Connect.
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Button
            variant="outlined"
            href="https://wa.me/6285701479245"
            target="_blank"
            rel="noreferrer noopener"
            startIcon={<AddIcon />}
          >
            Suggest Yours
          </Button>
        </Box>
        <Typography
          variant="caption"
          sx={{
            position: 'absolute',
            left: 24,
            bottom: 24,
            color: 'text.secondary',
            fontFamily: 'monospace',
          }}
        >
          Showcases
        </Typography>
        <Box
          sx={{
            ml: 'auto',
            width: { xs: '100%', sm: 600 },
            minWidth: { sm: 600 },
            mt: { xs: 4, sm: -6 },
            mb: { xs: 4, sm: -8 },
            pointerEvents: 'none',
            userSelect: 'none',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Image src={Design} alt="preview" priority width={600} height={300} style={{ objectFit: 'contain' }} />
        </Box>
      </StyledShowcaseContainer>

      <StyledVercelSection>
        <SvgIcon sx={{ fontSize: 24, mt: 0.5 }}>
          <path d="M37.5896 0.25L74.5396 64.25H0.639648L37.5896 0.25Z" />
        </SvgIcon>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 1 }}>
            JKT48Connect using the host of Vercel open source SDKs.
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {vercel.map((item) => (
              <Button
                key={item.url}
                component={Link}
                href={item.url}
                sx={{
                  color: 'text.secondary',
                  textTransform: 'none',
                  minWidth: 0,
                  px: 1,
                }}
              >
                {item.name}
              </Button>
            ))}
          </Box>
        </Box>
      </StyledVercelSection>

      <StyledShowcaseGrid container spacing={2}>
        {showcases.map((showcase) => (
          <Grid item xs={12} sm={6} lg={4} xl={3} key={showcase.url}>
            <ShowcaseItem {...showcase} />
          </Grid>
        ))}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            pt: 4,
            textAlign: 'center',
            zIndex: 2,
          }}
        >
          <Button
            component={Link}
            href="https://www.jkt48connect.my.id"
            variant="text"
            sx={{ textTransform: 'none' }}
          >
            See jkt48connect website
          </Button>
        </Box>
      </StyledShowcaseGrid>

      <Typography variant="h5" component="h2" sx={{ mt: 8, px: { xs: 2, sm: 4 }, fontWeight: 'medium' }}>
        JKT48Connect can power your bot, too.
      </Typography>
      <Grid container spacing={2} sx={{ mt: 3 }}>
        {blogs.map((showcase) => (
          <Grid item xs={12} sm={6} lg={4} xl={3} key={showcase.url}>
            <ShowcaseItem {...showcase} />
          </Grid>
        ))}
      </Grid>

      {/* New Projects Section */}
      <Typography variant="h5" component="h2" sx={{ mt: 12, mb: 3, fontWeight: 'medium' }}>
        Our Projects & Services
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Explore the complete ecosystem of tools and services built by JKT48Connect team.
      </Typography>

      {/* Category Filter */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4, alignItems: 'center' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'medium', color: 'text.secondary' }}>
          Categories:
        </Typography>
        {categories.map((category) => (
          <Chip
            key={category}
            label={category}
            variant="outlined"
            size="small"
            sx={{
              borderColor: 'divider',
              bgcolor: 'action.hover',
            }}
          />
        ))}
      </Box>

      {/* Projects Grid */}
      <Grid container spacing={3}>
        {projects.map((project, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <ProjectCard {...project} />
          </Grid>
        ))}
      </Grid>

      {/* Call to Action */}
      <Box
        sx={{
          mt: 12,
          textAlign: 'center',
          border: '1px dashed',
          borderColor: 'divider',
          p: 8,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 'medium' }}>
          Want to contribute or suggest a project?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          We&apos;re always looking for new ideas and contributions to expand the JKT48Connect
          ecosystem.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant="contained"
            href="https://github.com/jkt48connect"
            target="_blank"
            rel="noreferrer noopener"
            size="medium"
          >
            View on GitHub
          </Button>
          <Button
            variant="outlined"
            href="https://wa.me/6285701479245"
            target="_blank"
            rel="noreferrer noopener"
            size="medium"
          >
            Contact Us
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

function ShowcaseItem({ name, url, image }: ShowcaseObject) {
  if (image) {
    return (
      <Link
        href={url}
        target="_blank"
        rel="noreferrer noopener"
        style={{ textDecoration: 'none', display: 'block' }}
      >
        <Card
          sx={{
            position: 'relative',
            aspectRatio: '1.91 / 1',
            border: '1px dashed',
            borderColor: 'divider',
            overflow: 'hidden',
            '&:hover img': {
              filter: 'brightness(1.5)',
              transition: 'filter 0.3s ease',
            },
          }}
        >
          <Image
            alt="Preview"
            src={image}
            fill
            sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 2,
              bgcolor: 'background.default',
              px: 2,
              py: 1,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
              {name}
            </Typography>
          </Box>
        </Card>
      </Link>
    );
  }

  return (
    <Link
      href={url}
      target="_blank"
      rel="noreferrer noopener"
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          aspectRatio: '1.91 / 1',
          border: '1px dashed',
          borderColor: 'divider',
          p: 2,
          transition: 'background-color 0.3s ease',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace', mb: 1 }}>
          {new URL(url).hostname}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
          {name}
        </Typography>
      </Card>
    </Link>
  );
}

function ProjectCard({ name, description, category, url, status, tech }: ProjectObject) {
  return (
    <StyledProjectCard>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 'medium' }}>
              {name}
            </Typography>
            {url && (
              <Link
                href={url}
                target="_blank"
                rel="noreferrer noopener"
                sx={{
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  '.MuiCard-root:hover &': {
                    opacity: 1,
                  },
                  display: 'flex',
                }}
              >
                <SvgIcon sx={{ width: 16, height: 16 }}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </SvgIcon>
              </Link>
            )}
          </Box>
          <Chip
            label={status}
            size="small"
            sx={{
              ...getStatusColor(status),
              border: '1px solid', // Add border for consistency
              borderColor: 'currentColor', // Use color from status for border
            }}
          />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Chip
            label={category}
            size="small"
            sx={{
              bgcolor: 'primary.light',
              color: 'primary.contrastText',
              fontWeight: 'medium',
            }}
          />

          {tech && tech.length > 0 && (
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {tech.slice(0, 3).map((technology, index) => (
                <Chip
                  key={index}
                  label={technology}
                  size="small"
                  variant="outlined"
                  sx={{
                    bgcolor: 'action.selected',
                    borderColor: 'divider',
                  }}
                />
              ))}
              {tech.length > 3 && (
                <Chip
                  label={`+${tech.length - 3}`}
                  size="small"
                  variant="outlined"
                  sx={{
                    bgcolor: 'action.selected',
                    borderColor: 'divider',
                  }}
                />
              )}
            </Box>
          )}
        </Box>
      </CardContent>
    </StyledProjectCard>
  );
}
