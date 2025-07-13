# Domain Security Checker

A comprehensive web application for analyzing domain security and email authentication protocols. Built with React, TypeScript, and Material-UI.

## Features

### Main Security Dashboard
- **Comprehensive Domain Analysis**: Analyze SPF, DKIM, and DMARC configurations for any domain
- **Security Scoring**: Get detailed security scores and grades for each protocol
- **Visual Reports**: Beautiful, interactive dashboards with detailed breakdowns
- **Real-time Analysis**: Fast API calls with response time tracking

### SPF Record Checker
- **Detailed SPF Analysis**: Comprehensive analysis of SPF (Sender Policy Framework) records
- **Record Chain Visualization**: View the complete chain of SPF records including redirects and includes
- **Validation Results**: Check syntax, record count, and security best practices
- **Scoring System**: Get detailed scoring for SPF configuration with specific recommendations

### DKIM Record Checker
- **Comprehensive DKIM Analysis**: Detailed analysis of DKIM (DomainKeys Identified Mail) records
- **Multiple Selector Support**: View all DKIM selectors and their configurations
- **Key Strength Analysis**: Analyze public key lengths and security strength
- **Detailed Record Breakdown**: Expandable sections showing raw records and parsed data
- **Security Scoring**: Get detailed scoring for DKIM configuration with specific recommendations

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd domain-security-checker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Main Security Dashboard
1. Enter a domain name in the input field
2. Click "Analyze" to get comprehensive security analysis
3. View detailed scores for SPF, DKIM, and DMARC protocols

### SPF Record Checker
1. Click on "Free Tools" in the header
2. Select "SPF Checker" from the dropdown menu
3. Enter a domain name to analyze its SPF records
4. View detailed analysis including:
   - SPF record chain
   - Validation results
   - Security scoring
   - Recommendations

### DKIM Record Checker
1. Click on "Free Tools" in the header
2. Select "DKIM Checker" from the dropdown menu
3. Enter a domain name to analyze its DKIM records
4. View detailed analysis including:
   - DKIM record summary
   - Security score breakdown
   - Individual selector analysis
   - Raw record details
   - Public key information

## API Endpoints

The application uses the following API endpoints:

- `GET /api/score?domain=<domain>` - Get comprehensive security analysis
- `GET /api/spf?domain=<domain>` - Get detailed SPF analysis
- `GET /api/dkim?domain=<domain>` - Get detailed DKIM analysis

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **UI Framework**: Material-UI (MUI)
- **Build Tool**: Vite
- **Styling**: Emotion (via MUI)
- **Icons**: Material-UI Icons
- **Animations**: Framer Motion
- **Deployment**: Cloudflare Pages

## Deployment

### Cloudflare Pages

This project is configured for deployment on Cloudflare Pages.

#### Prerequisites
- Cloudflare account
- Wrangler CLI installed (`npm install -g wrangler`)

#### Environment Variables
Create a `.env` file with your backend API URL:
```bash
VITE_API_HOST=https://your-backend-worker.your-subdomain.workers.dev
```

#### Deployment Steps

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to Pages**:
   ```bash
   npm run deploy
   ```

#### Alternative: GitHub Integration
1. Connect your GitHub repository to Cloudflare Pages
2. Set build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Environment variables: Add `VITE_API_HOST` with your backend Worker URL

#### API Configuration
Update the `VITE_API_HOST` environment variable to point to your separate backend Worker that handles the API endpoints:
- `GET /api/score?domain=<domain>` - Get comprehensive security analysis
- `GET /api/spf?domain=<domain>` - Get detailed SPF analysis
- `GET /api/dkim?domain=<domain>` - Get detailed DKIM analysis

## Project Structure

```
src/
├── components/
│   ├── DomainInput.tsx          # Domain input component
│   ├── SecurityDashboard.tsx    # Main security dashboard
│   ├── SecurityCard.tsx         # Individual security protocol cards
│   ├── SpfChecker.tsx           # SPF-specific analysis page
│   ├── DkimChecker.tsx          # DKIM-specific analysis page
│   ├── Header.tsx               # Application header with navigation
│   └── Footer.tsx               # Application footer
├── types/
│   ├── security.ts              # Main security types
│   ├── spf.ts                   # SPF-specific types
│   └── dkim.ts                  # DKIM-specific types
├── assets/                      # Static assets
├── App.tsx                      # Main application component
└── main.tsx                     # Application entry point
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Code Style

The project uses:
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Material-UI design system

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
