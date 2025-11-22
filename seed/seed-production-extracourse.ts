import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const extraCourseData = {
  title: 'Web Development - Ekstra Kurikuler',
  slug: 'web-development-ekstra',
  description: 'Program pembelajaran Web Development dari dasar hingga fullstack untuk siswa SMA Wahidiyah. Kurikulum terstruktur dari Level 0 (Fondasi) sampai Level 13 (Fullstack Project).',
  level: 'XI-XII',
  subject: 'Ekstra Kurikuler',
  isActive: true,
  order: 1,
  modules: [
    {
      title: 'Level 0 — Fondasi Wajib',
      slug: 'level-0-fondasi-wajib',
      description: 'Fondasi penting sebelum memulai Web Development: pengenalan internet, cara kerja web, tools dasar, dan setup environment.',
      chapter: 'Level 0',
      order: 0,
      isActive: true,
      lessons: [
        {
          title: 'Pengenalan Internet & Web',
          slug: 'level-0-pengenalan-internet-web',
          description: 'Memahami cara kerja internet, client-server, HTTP/HTTPS, domain, dan hosting.',
          order: 1
        },
        {
          title: 'Text Editor & Browser DevTools',
          slug: 'level-0-text-editor-devtools',
          description: 'Setup VS Code, extension wajib, dan cara menggunakan Chrome/Firefox DevTools.',
          order: 2
        },
        {
          title: 'Terminal & Command Line Basics',
          slug: 'level-0-terminal-command-line',
          description: 'Perintah dasar terminal: cd, ls, mkdir, touch, rm, dan navigasi file system.',
          order: 3
        },
        {
          title: 'File & Folder Structure Web Project',
          slug: 'level-0-file-folder-structure',
          description: 'Best practice struktur folder project: assets, css, js, images, naming convention.',
          order: 4
        }
      ]
    },
    
    {
      title: 'Level 1 — HTML Dasar',
      slug: 'level-1-html-dasar',
      description: 'Belajar struktur HTML, semantic tags, form, table, dan best practices HTML5.',
      chapter: 'Level 1',
      order: 1,
      isActive: true,
      lessons: [
        {
          title: 'Struktur Dasar HTML',
          slug: 'level-1-struktur-dasar-html',
          description: 'DOCTYPE, html, head, body, meta tags, title, dan semantic structure.',
          order: 1
        },
        {
          title: 'Text Elements',
          slug: 'level-1-text-elements',
          description: 'Heading (h1-h6), paragraph, strong, em, blockquote, pre, code.',
          order: 2
        },
        {
          title: 'Lists & Links',
          slug: 'level-1-lists-links',
          description: 'Ordered list (ol), unordered list (ul), anchor tag (a), internal & external links.',
          order: 3
        },
        {
          title: 'Images & Multimedia',
          slug: 'level-1-images-multimedia',
          description: 'Image tag, alt text, figure, audio, video, iframe untuk embed.',
          order: 4
        },
        {
          title: 'Forms & Input',
          slug: 'level-1-forms-input',
          description: 'Form element, input types, textarea, select, button, label, validation.',
          order: 5
        },
        {
          title: 'Tables',
          slug: 'level-1-tables',
          description: 'Table structure: table, thead, tbody, tr, th, td, colspan, rowspan.',
          order: 6
        },
        {
          title: 'Semantic HTML5',
          slug: 'level-1-semantic-html5',
          description: 'header, nav, main, article, section, aside, footer, semantic importance.',
          order: 7
        }
      ]
    },
    
    {
      title: 'Level 2 — CSS Dasar',
      slug: 'level-2-css-dasar',
      description: 'Styling dasar dengan CSS: selector, box model, typography, colors, dan layout sederhana.',
      chapter: 'Level 2',
      order: 2,
      isActive: true,
      lessons: [
        {
          title: 'CSS Syntax & Selectors',
          slug: 'level-2-css-syntax-selectors',
          description: 'Syntax CSS, class selector, id selector, element selector, attribute selector.',
          order: 1
        },
        {
          title: 'Colors & Backgrounds',
          slug: 'level-2-colors-backgrounds',
          description: 'Color formats (hex, rgb, hsl), background-color, background-image, gradients.',
          order: 2
        },
        {
          title: 'Typography',
          slug: 'level-2-typography',
          description: 'font-family, font-size, font-weight, line-height, text-align, Google Fonts.',
          order: 3
        },
        {
          title: 'Box Model',
          slug: 'level-2-box-model',
          description: 'margin, padding, border, width, height, box-sizing: border-box.',
          order: 4
        },
        {
          title: 'Display & Positioning',
          slug: 'level-2-display-positioning',
          description: 'display: block/inline/inline-block, position: static/relative/absolute/fixed.',
          order: 5
        },
        {
          title: 'Basic Layout',
          slug: 'level-2-basic-layout',
          description: 'Float, clear, simple column layout, centering elements.',
          order: 6
        }
      ]
    },
    
    {
      title: 'Level 3 — CSS Menengah',
      slug: 'level-3-css-menengah',
      description: 'CSS lanjutan: Flexbox, Grid, responsive design, animations, dan pseudo classes.',
      chapter: 'Level 3',
      order: 3,
      isActive: true,
      lessons: [
        {
          title: 'Flexbox Layout',
          slug: 'level-3-flexbox-layout',
          description: 'flex-direction, justify-content, align-items, flex-wrap, flex-grow/shrink.',
          order: 1
        },
        {
          title: 'CSS Grid Layout',
          slug: 'level-3-css-grid-layout',
          description: 'grid-template-columns/rows, gap, grid-area, responsive grid systems.',
          order: 2
        },
        {
          title: 'Responsive Design',
          slug: 'level-3-responsive-design',
          description: 'Media queries, mobile-first approach, breakpoints, viewport meta tag.',
          order: 3
        },
        {
          title: 'Pseudo Classes & Elements',
          slug: 'level-3-pseudo-classes-elements',
          description: ':hover, :focus, :active, :nth-child, ::before, ::after untuk styling dinamis.',
          order: 4
        },
        {
          title: 'Transitions & Animations',
          slug: 'level-3-transitions-animations',
          description: 'CSS transitions, @keyframes, animation properties, transform, timing functions.',
          order: 5
        },
        {
          title: 'Advanced Selectors',
          slug: 'level-3-advanced-selectors',
          description: 'Combinators: descendant, child (>), sibling (~, +), :not(), :is().',
          order: 6
        }
      ]
    },
    
    {
      title: 'Level 4 — JavaScript Dasar',
      slug: 'level-4-javascript-dasar',
      description: 'Fundamental JavaScript: variables, data types, operators, control flow, functions.',
      chapter: 'Level 4',
      order: 4,
      isActive: true,
      lessons: [
        {
          title: 'Variables & Data Types',
          slug: 'level-4-variables-data-types',
          description: 'let, const, var, string, number, boolean, null, undefined, typeof.',
          order: 1
        },
        {
          title: 'Operators',
          slug: 'level-4-operators',
          description: 'Arithmetic, comparison, logical, ternary operator, operator precedence.',
          order: 2
        },
        {
          title: 'Control Flow',
          slug: 'level-4-control-flow',
          description: 'if-else, switch-case, for loop, while loop, do-while, break, continue.',
          order: 3
        },
        {
          title: 'Functions',
          slug: 'level-4-functions',
          description: 'Function declaration, expression, arrow function, parameters, return, scope.',
          order: 4
        },
        {
          title: 'Arrays',
          slug: 'level-4-arrays',
          description: 'Array methods: push, pop, shift, unshift, slice, splice, forEach, map.',
          order: 5
        },
        {
          title: 'Objects',
          slug: 'level-4-objects',
          description: 'Object literals, properties, methods, this keyword, object destructuring.',
          order: 6
        },
        {
          title: 'String Methods',
          slug: 'level-4-string-methods',
          description: 'Template literals, length, charAt, indexOf, slice, split, trim, includes.',
          order: 7
        }
      ]
    },
    
    {
      title: 'Level 5 — DOM Manipulation',
      slug: 'level-5-dom-manipulation',
      description: 'Manipulasi HTML dengan JavaScript: selecting elements, events, dynamic content.',
      chapter: 'Level 5',
      order: 5,
      isActive: true,
      lessons: [
        {
          title: 'DOM Fundamentals',
          slug: 'level-5-dom-fundamentals',
          description: 'Document Object Model, DOM tree, nodes, element vs node.',
          order: 1
        },
        {
          title: 'Selecting Elements',
          slug: 'level-5-selecting-elements',
          description: 'getElementById, querySelector, querySelectorAll, getElementsByClassName.',
          order: 2
        },
        {
          title: 'Manipulating Content',
          slug: 'level-5-manipulating-content',
          description: 'innerHTML, textContent, innerText, creating elements, appendChild, remove.',
          order: 3
        },
        {
          title: 'Manipulating Attributes & Styles',
          slug: 'level-5-manipulating-attributes-styles',
          description: 'getAttribute, setAttribute, classList.add/remove/toggle, style property.',
          order: 4
        },
        {
          title: 'Event Handling',
          slug: 'level-5-event-handling',
          description: 'addEventListener, event object, click, submit, keyup, preventDefault.',
          order: 5
        },
        {
          title: 'Form Handling & Validation',
          slug: 'level-5-form-handling-validation',
          description: 'Form submission, input validation, displaying errors, user feedback.',
          order: 6
        }
      ]
    },
    
    {
      title: 'Level 6 — JavaScript Lanjutan',
      slug: 'level-6-javascript-lanjutan',
      description: 'Konsep JavaScript modern: ES6+, async programming, modules, error handling.',
      chapter: 'Level 6',
      order: 6,
      isActive: true,
      lessons: [
        {
          title: 'ES6+ Features',
          slug: 'level-6-es6-features',
          description: 'Spread operator, rest parameters, destructuring, default parameters.',
          order: 1
        },
        {
          title: 'Array Methods Advanced',
          slug: 'level-6-array-methods-advanced',
          description: 'filter, find, reduce, some, every, sort, chaining methods.',
          order: 2
        },
        {
          title: 'Asynchronous JavaScript',
          slug: 'level-6-asynchronous-javascript',
          description: 'Callbacks, Promises, async/await, setTimeout, setInterval.',
          order: 3
        },
        {
          title: 'Fetch API & AJAX',
          slug: 'level-6-fetch-api-ajax',
          description: 'fetch(), handling responses, JSON.parse/stringify, HTTP methods.',
          order: 4
        },
        {
          title: 'Error Handling',
          slug: 'level-6-error-handling',
          description: 'try-catch, throw, Error objects, debugging dengan console.',
          order: 5
        },
        {
          title: 'ES6 Modules',
          slug: 'level-6-es6-modules',
          description: 'import/export, named exports, default exports, module bundlers.',
          order: 6
        },
        {
          title: 'Local Storage & Session Storage',
          slug: 'level-6-local-storage',
          description: 'localStorage API, sessionStorage, JSON storage, persistence.',
          order: 7
        }
      ]
    },
    
    {
      title: 'Level 7 — Git & Version Control',
      slug: 'level-7-git-version-control',
      description: 'Version control dengan Git dan kolaborasi menggunakan GitHub.',
      chapter: 'Level 7',
      order: 7,
      isActive: true,
      lessons: [
        {
          title: 'Git Fundamentals',
          slug: 'level-7-git-fundamentals',
          description: 'Pengenalan Git, repository, commit, staging area, git workflow.',
          order: 1
        },
        {
          title: 'Basic Git Commands',
          slug: 'level-7-basic-git-commands',
          description: 'git init, add, commit, status, log, diff, gitignore.',
          order: 2
        },
        {
          title: 'Branching & Merging',
          slug: 'level-7-branching-merging',
          description: 'git branch, checkout, merge, resolving conflicts, branch strategies.',
          order: 3
        },
        {
          title: 'GitHub Basics',
          slug: 'level-7-github-basics',
          description: 'GitHub account, repository, README.md, push, pull, clone.',
          order: 4
        },
        {
          title: 'Collaboration & Pull Requests',
          slug: 'level-7-collaboration-pr',
          description: 'Fork, pull request, code review, issues, GitHub workflow.',
          order: 5
        },
        {
          title: 'Git Best Practices',
          slug: 'level-7-git-best-practices',
          description: 'Commit messages, branching strategy, .gitignore patterns, collaboration tips.',
          order: 6
        }
      ]
    },
    
    {
      title: 'Level 8 — TailwindCSS',
      slug: 'level-8-tailwindcss',
      description: 'Utility-first CSS framework untuk rapid UI development.',
      chapter: 'Level 8',
      order: 8,
      isActive: true,
      lessons: [
        {
          title: 'TailwindCSS Introduction',
          slug: 'level-8-tailwindcss-introduction',
          description: 'Utility-first concept, setup Tailwind, CDN vs CLI, configuration.',
          order: 1
        },
        {
          title: 'Core Concepts',
          slug: 'level-8-core-concepts',
          description: 'Utility classes, responsive modifiers, hover/focus states, dark mode.',
          order: 2
        },
        {
          title: 'Layout Utilities',
          slug: 'level-8-layout-utilities',
          description: 'Container, flex, grid, positioning utilities, spacing (m, p).',
          order: 3
        },
        {
          title: 'Typography & Colors',
          slug: 'level-8-typography-colors',
          description: 'Text utilities, font families, color palette, custom colors.',
          order: 4
        },
        {
          title: 'Components',
          slug: 'level-8-components',
          description: 'Building cards, buttons, forms, navbars dengan Tailwind utilities.',
          order: 5
        },
        {
          title: 'Responsive Design with Tailwind',
          slug: 'level-8-responsive-design',
          description: 'Breakpoints (sm, md, lg, xl), mobile-first utilities, responsive grid.',
          order: 6
        },
        {
          title: 'Customization & Plugins',
          slug: 'level-8-customization-plugins',
          description: 'tailwind.config.js, extending theme, custom utilities, plugins.',
          order: 7
        }
      ]
    },
    
    {
      title: 'Level 9 — React Dasar',
      slug: 'level-9-react-dasar',
      description: 'Fundamental React: components, JSX, props, state, dan lifecycle.',
      chapter: 'Level 9',
      order: 9,
      isActive: true,
      lessons: [
        {
          title: 'React Introduction',
          slug: 'level-9-react-introduction',
          description: 'Apa itu React, Virtual DOM, SPA concept, setup dengan Vite.',
          order: 1
        },
        {
          title: 'JSX & Components',
          slug: 'level-9-jsx-components',
          description: 'JSX syntax, functional components, component composition, props.',
          order: 2
        },
        {
          title: 'State & useState',
          slug: 'level-9-state-usestate',
          description: 'useState hook, state management, updating state, immutability.',
          order: 3
        },
        {
          title: 'Events & Handling',
          slug: 'level-9-events-handling',
          description: 'Event handling dalam React, onClick, onChange, onSubmit, synthetic events.',
          order: 4
        },
        {
          title: 'Conditional Rendering',
          slug: 'level-9-conditional-rendering',
          description: 'if-else dalam JSX, ternary operator, && operator, conditional classes.',
          order: 5
        },
        {
          title: 'Lists & Keys',
          slug: 'level-9-lists-keys',
          description: 'Rendering lists dengan map(), key prop, dynamic lists.',
          order: 6
        },
        {
          title: 'Forms in React',
          slug: 'level-9-forms-react',
          description: 'Controlled components, form handling, multiple inputs, validation.',
          order: 7
        }
      ]
    },
    
    {
      title: 'Level 10 — React Lanjutan',
      slug: 'level-10-react-lanjutan',
      description: 'React advanced: hooks, context API, routing, performance optimization.',
      chapter: 'Level 10',
      order: 10,
      isActive: true,
      lessons: [
        {
          title: 'useEffect Hook',
          slug: 'level-10-useeffect-hook',
          description: 'useEffect untuk side effects, dependencies, cleanup, lifecycle equivalents.',
          order: 1
        },
        {
          title: 'Custom Hooks',
          slug: 'level-10-custom-hooks',
          description: 'Creating custom hooks, reusing logic, hook best practices.',
          order: 2
        },
        {
          title: 'Context API',
          slug: 'level-10-context-api',
          description: 'createContext, useContext, Provider pattern, global state.',
          order: 3
        },
        {
          title: 'React Router',
          slug: 'level-10-react-router',
          description: 'React Router setup, routes, Link, useNavigate, dynamic routes, params.',
          order: 4
        },
        {
          title: 'HTTP Requests in React',
          slug: 'level-10-http-requests-react',
          description: 'fetch dalam useEffect, loading states, error handling, axios.',
          order: 5
        },
        {
          title: 'Performance Optimization',
          slug: 'level-10-performance-optimization',
          description: 'useMemo, useCallback, React.memo, lazy loading, code splitting.',
          order: 6
        },
        {
          title: 'State Management Libraries',
          slug: 'level-10-state-management-libraries',
          description: 'Introduction to Zustand/Redux, when to use, global state patterns.',
          order: 7
        }
      ]
    },
    
    {
      title: 'Level 11 — Backend Dasar (Node.js)',
      slug: 'level-11-backend-dasar-nodejs',
      description: 'Server-side programming dengan Node.js dan Express.js.',
      chapter: 'Level 11',
      order: 11,
      isActive: true,
      lessons: [
        {
          title: 'Node.js Fundamentals',
          slug: 'level-11-nodejs-fundamentals',
          description: 'Node.js introduction, NPM, package.json, modules, CommonJS vs ES6.',
          order: 1
        },
        {
          title: 'Express.js Basics',
          slug: 'level-11-expressjs-basics',
          description: 'Express setup, routing, middleware, req/res objects, HTTP methods.',
          order: 2
        },
        {
          title: 'RESTful API Design',
          slug: 'level-11-restful-api-design',
          description: 'REST principles, CRUD operations, HTTP status codes, API structure.',
          order: 3
        },
        {
          title: 'Middleware',
          slug: 'level-11-middleware',
          description: 'Express middleware, body-parser, CORS, error handling middleware.',
          order: 4
        },
        {
          title: 'File System & Path',
          slug: 'level-11-file-system-path',
          description: 'fs module, reading/writing files, path module, async operations.',
          order: 5
        },
        {
          title: 'Environment Variables',
          slug: 'level-11-environment-variables',
          description: 'dotenv, process.env, configuration management, security best practices.',
          order: 6
        },
        {
          title: 'Authentication Basics',
          slug: 'level-11-authentication-basics',
          description: 'JWT introduction, bcrypt, hashing passwords, authentication flow.',
          order: 7
        }
      ]
    },
    
    {
      title: 'Level 12 — Database Dasar',
      slug: 'level-12-database-dasar',
      description: 'Database relational dengan PostgreSQL/MySQL dan Prisma ORM.',
      chapter: 'Level 12',
      order: 12,
      isActive: true,
      lessons: [
        {
          title: 'Database Fundamentals',
          slug: 'level-12-database-fundamentals',
          description: 'RDBMS vs NoSQL, tables, rows, columns, primary key, foreign key.',
          order: 1
        },
        {
          title: 'SQL Basics',
          slug: 'level-12-sql-basics',
          description: 'SELECT, INSERT, UPDATE, DELETE, WHERE, ORDER BY, LIMIT.',
          order: 2
        },
        {
          title: 'SQL Joins & Relations',
          slug: 'level-12-sql-joins-relations',
          description: 'INNER JOIN, LEFT JOIN, one-to-many, many-to-many relationships.',
          order: 3
        },
        {
          title: 'Prisma ORM Introduction',
          slug: 'level-12-prisma-orm-introduction',
          description: 'Prisma setup, schema, models, migrations, Prisma Client.',
          order: 4
        },
        {
          title: 'CRUD Operations with Prisma',
          slug: 'level-12-crud-operations-prisma',
          description: 'create, findMany, findUnique, update, delete with Prisma.',
          order: 5
        },
        {
          title: 'Relations in Prisma',
          slug: 'level-12-relations-prisma',
          description: 'Defining relations, include, select, nested queries.',
          order: 6
        },
        {
          title: 'Database Best Practices',
          slug: 'level-12-database-best-practices',
          description: 'Indexing, query optimization, data validation, backup strategies.',
          order: 7
        }
      ]
    },
    
    {
      title: 'Level 13 — Fullstack Mini Project',
      slug: 'level-13-fullstack-mini-project',
      description: 'Capstone project: Build fullstack web app dengan React + Node.js + Database.',
      chapter: 'Level 13',
      order: 13,
      isActive: true,
      lessons: [
        {
          title: 'Project Planning & Design',
          slug: 'level-13-project-planning-design',
          description: 'Requirement analysis, wireframing, database schema design, API planning.',
          order: 1
        },
        {
          title: 'Backend Setup',
          slug: 'level-13-backend-setup',
          description: 'Express server, Prisma setup, database connection, environment config.',
          order: 2
        },
        {
          title: 'API Development',
          slug: 'level-13-api-development',
          description: 'Creating REST endpoints, CRUD operations, authentication, validation.',
          order: 3
        },
        {
          title: 'Frontend Setup',
          slug: 'level-13-frontend-setup',
          description: 'React + Vite setup, TailwindCSS, routing, project structure.',
          order: 4
        },
        {
          title: 'Frontend-Backend Integration',
          slug: 'level-13-frontend-backend-integration',
          description: 'API calls, state management, loading/error states, authentication flow.',
          order: 5
        },
        {
          title: 'Testing & Debugging',
          slug: 'level-13-testing-debugging',
          description: 'Testing API endpoints, frontend testing, debugging techniques.',
          order: 6
        },
        {
          title: 'Deployment',
          slug: 'level-13-deployment',
          description: 'Deploy backend (Railway/Render), frontend (Vercel/Netlify), database hosting.',
          order: 7
        },
        {
          title: 'Project Presentation',
          slug: 'level-13-project-presentation',
          description: 'Documentation, README, demo video, code review, portfolio showcase.',
          order: 8
        }
      ]
    }
  ]
}

async function main() {
  console.log('🎓 Seeding Extra Course: Web Development...')

  // Check if course exists
  const existing = await prisma.course.findUnique({
    where: { slug: extraCourseData.slug }
  })

  let course
  if (existing) {
    console.log(`📚 Updating existing course: ${extraCourseData.title}`)
    course = await prisma.course.update({
      where: { slug: extraCourseData.slug },
      data: {
        title: extraCourseData.title,
        description: extraCourseData.description,
        level: extraCourseData.level,
        subject: extraCourseData.subject,
        isActive: extraCourseData.isActive,
        order: extraCourseData.order
      }
    })
  } else {
    console.log(`📚 Creating new course: ${extraCourseData.title}`)
    course = await prisma.course.create({
      data: {
        title: extraCourseData.title,
        slug: extraCourseData.slug,
        description: extraCourseData.description,
        level: extraCourseData.level,
        subject: extraCourseData.subject,
        isActive: extraCourseData.isActive,
        order: extraCourseData.order
      }
    })
  }

  console.log(`✅ Course created/updated: ${course.title}`)

  // Create/update modules and lessons
  for (const moduleData of extraCourseData.modules) {
    const { lessons, ...moduleInfo } = moduleData

    const existingModule = await prisma.module.findUnique({
      where: { slug: moduleInfo.slug }
    })

    let courseModule
    if (existingModule) {
      courseModule = await prisma.module.update({
        where: { slug: moduleInfo.slug },
        data: {
          ...moduleInfo,
          courseId: course.id
        }
      })
      console.log(`  ✅ Updated module: ${moduleInfo.title}`)
    } else {
      courseModule = await prisma.module.create({
        data: {
          ...moduleInfo,
          courseId: course.id
        }
      })
      console.log(`  ✅ Created module: ${moduleInfo.title}`)
    }

    // Create/update lessons
    for (const lessonData of lessons) {
      const existingLesson = await prisma.lesson.findUnique({
        where: { slug: lessonData.slug }
      })

      if (existingLesson) {
        await prisma.lesson.update({
          where: { slug: lessonData.slug },
          data: {
            ...lessonData,
            moduleId: courseModule.id,
            isActive: true
          }
        })
        console.log(`    ✅ Updated lesson: ${lessonData.title}`)
      } else {
        await prisma.lesson.create({
          data: {
            ...lessonData,
            moduleId: courseModule.id,
            isActive: true
          }
        })
        console.log(`    ✅ Created lesson: ${lessonData.title}`)
      }
    }
  }

  const totalModules = extraCourseData.modules.length
  const totalLessons = extraCourseData.modules.reduce((sum, m) => sum + m.lessons.length, 0)

  console.log(`\n✅ Extra Course Seed Complete!`)
  console.log(`   📚 Course: ${course.title}`)
  console.log(`   📦 Modules: ${totalModules} (Level 0 - Level 13)`)
  console.log(`   📝 Lessons: ${totalLessons} total`)
  console.log(`   🎯 Ready for Ekstra Kurikuler Web Development!`)
}

main()
  .catch((error) => {
    console.error('❌ Error seeding extra course:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
