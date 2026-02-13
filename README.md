# My Portfolio

A modern, responsive portfolio website built with Next.js and TypeScript, showcasing my skills as a full-stack developer with a focus on AI integration.

## 🌐 Live Demo

Visit the live portfolio: [https://hmiyazaki95.github.io/my-portfolio/](https://hmiyazaki95.github.io/my-portfolio/)

## ✨ Features

- **Responsive Design**: Fully responsive across all device sizes
- **Smooth Navigation**: Smooth scrolling navigation between sections
- **Modern UI**: Clean, professional design with hover effects and animations
- **Skills Visualization**: Interactive skill bars showing proficiency levels
- **Project Showcase**: Dedicated section for featured projects
- **Contact Information**: Easy-to-find contact details and social links

## 🛠️ Tech Stack

- **Framework**: Next.js 14.2.4
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **Deployment**: GitHub Pages
- **Build Tool**: Next.js Static Export

## 📁 Project Structure

```
my-portfolio/
├── Components/
│   ├── About.tsx           # About section
│   ├── Footer.tsx          # Contact/Footer section
│   ├── Hero.tsx            # Hero/Landing section
│   ├── MobileNav.tsx       # Mobile navigation
│   ├── Nav.tsx             # Desktop navigation
│   ├── Projects.tsx        # Projects showcase
│   ├── Services.tsx        # Services offered
│   ├── Skills.tsx          # Skills and education
│   ├── SkillsItem.tsx      # Individual skill item
│   └── SkillsLanguage.tsx  # Skill progress bars
├── pages/
│   ├── index.tsx           # Main page
│   └── _document.tsx       # Document structure
├── public/
│   └── images/             # Static images
├── styles/
│   └── globals.css         # Global styles
└── next.config.mjs         # Next.js configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/hmiyazaki95/my-portfolio.git
cd my-portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔧 Configuration

### GitHub Pages Deployment

The project is configured for GitHub Pages deployment with:
- Static export enabled in `next.config.mjs`
- GitHub Actions workflow in `.github/workflows/nextjs.yml`
- Automatic deployment on push to main branch

### Customization

To customize the portfolio:

1. **Content**: Update text content in each component file
2. **Images**: Replace images in the `public/images/` directory
3. **Skills**: Modify skill levels in `Components/Skills.tsx`
4. **Colors**: Adjust the color scheme in Tailwind classes
5. **Sections**: Hide/show sections by commenting out in `pages/index.tsx`

## 🎨 Design Features

- **Dark Theme**: Professional dark color scheme
- **Smooth Scrolling**: Navigation smoothly scrolls to sections
- **Hover Effects**: Interactive elements with hover animations
- **Mobile-First**: Responsive design optimized for mobile devices
- **Performance**: Optimized images and efficient loading

## 📱 Sections

1. **Home**: Hero section with introduction and call-to-action
2. **Services**: Overview of services offered (Frontend, Backend, Fullstack)
3. **About**: Personal background and expertise
4. **Skills**: Education timeline and technical skills
5. **Projects**: Featured project showcase
6. **Contact**: Contact information and social links

## 🚀 Deployment

The portfolio automatically deploys to GitHub Pages when changes are pushed to the main branch. The deployment process:

1. GitHub Actions builds the project
2. Generates static files for GitHub Pages
3. Deploys to the `gh-pages` branch
4. Site becomes available at the GitHub Pages URL

## 🤝 Contributing

This is a personal portfolio project. If you'd like to use this as a template:

1. Fork the repository
2. Update the content with your information
3. Customize the design to match your preferences
4. Deploy to your own GitHub Pages

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Contact

**Hajime Miyazaki**
- Portfolio: [https://hmiyazaki95.github.io/my-portfolio/](https://hmiyazaki95.github.io/my-portfolio/)
- Email: hmiyazakiemail6@gmail.com
- GitHub: [hMiyazaki95](https://github.com/hMiyazaki95)

---

Built with ❤️ using Next.js and TypeScript
