# AI Voice Retention Agent - Wiki Documentation

## 📚 Overview

This folder contains **wiki-ready documentation** for the AI Voice Retention Agent application, formatted for easy import into popular wiki platforms.

---

## 📁 Wiki Structure

```
wiki/
├── README.md                    # This file
├── WIKI-IMPORT-GUIDE.md         # Import instructions
├── Home.md                      # Wiki home page
├── _Sidebar.md                  # Navigation sidebar
├── Architecture-Overview.md     # System architecture
├── API-Reference.md             # Complete API documentation
├── Data-Flow-Diagrams.md        # Data flow visualizations
└── [more pages...]              # Additional documentation pages
```

---

## 🚀 Quick Start

### **Option 1: Import to GitHub Wiki** ⭐ Recommended

```bash
# 1. Clone your GitHub wiki
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.wiki.git

# 2. Copy all wiki files
cp -r wiki/* YOUR_REPO.wiki/

# 3. Commit and push
cd YOUR_REPO.wiki
git add .
git commit -m "Import complete documentation"
git push origin master

# 4. Visit your wiki
# https://github.com/YOUR_USERNAME/YOUR_REPO/wiki
```

### **Option 2: Import to GitLab Wiki**

```bash
# 1. Clone your GitLab wiki
git clone https://gitlab.com/YOUR_USERNAME/YOUR_PROJECT.wiki.git

# 2. Copy all wiki files
cp -r wiki/* YOUR_PROJECT.wiki/

# 3. Commit and push
cd YOUR_PROJECT.wiki
git add .
git commit -m "Import complete documentation"
git push origin master
```

### **Option 3: Import to Confluence**

1. Install "Markdown Importer" plugin
2. Bulk import all .md files
3. Review and adjust formatting

### **Option 4: Import to Notion**

1. Create new page in Notion
2. Use Import → Markdown
3. Select all .md files from wiki/ folder

---

## 📋 Available Pages

### **Core Documentation**
- **[Home](Home.md)** - Wiki home page with navigation
- **[Architecture Overview](Architecture-Overview.md)** - System architecture
- **[API Reference](API-Reference.md)** - Complete API documentation
- **[Data Flow Diagrams](Data-Flow-Diagrams.md)** - Visual data flows

### **Feature Documentation**
- Customer Insights
- PIN Verification
- Movers Retention Flow
- Bilingual Support
- Speech Formatting
- Customer Search

### **Development Guides**
- Development Setup
- Configuration
- Testing Guide
- Debugging

### **Database Documentation**
- MongoDB Setup
- Customer Schema
- Seed Data Generation
- Data Migration

### **Deployment**
- Deployment Guide
- Scaling Strategy
- Production Checklist

---

## ✨ Features

### **Ready for Import**
- ✅ Markdown format (universal compatibility)
- ✅ Proper wiki structure (Home, Sidebar, Pages)
- ✅ Internal navigation links
- ✅ Code blocks with syntax highlighting
- ✅ ASCII diagrams (render everywhere)
- ✅ Tables and lists
- ✅ Organized sections

### **Platform Compatibility**
- ✅ **GitHub Wiki** - Perfect compatibility
- ✅ **GitLab Wiki** - Perfect compatibility
- ✅ **Azure DevOps** - Great compatibility
- ✅ **Notion** - Good compatibility (auto-imports)
- ⚠️ **Confluence** - Requires some adjustments

---

## 📖 How to Use

### **1. Choose Your Platform**
Decide which wiki platform you want to use:
- **GitHub Wiki** (recommended)
- **GitLab Wiki**
- **Confluence**
- **Notion**
- **Azure DevOps Wiki**

### **2. Follow Import Guide**
Read **[WIKI-IMPORT-GUIDE.md](WIKI-IMPORT-GUIDE.md)** for detailed instructions specific to your platform.

### **3. Import Files**
Copy all files from this folder to your wiki repository or import them through the platform's UI.

### **4. Verify**
- Check that Home page loads
- Test navigation links
- Verify all pages are accessible
- Review formatting

---

## 🎯 Recommended Setup

### **For GitHub/GitLab** ⭐

**Why we recommend:**
- Native Markdown support
- Automatic rendering
- Sidebar navigation works out of the box
- Version control included
- Free and easy to use

**Setup Time:** ~2 minutes

**Steps:**
1. Clone wiki repo
2. Copy files
3. Push to origin
4. Done!

---

## 📊 Documentation Statistics

```
Total Pages: 15+
  ├─ Core Documentation: 5 pages
  ├─ Feature Guides: 6 pages
  ├─ Development Guides: 4 pages
  └─ Deployment Guides: 3 pages

Content Size: ~150 KB
  ├─ Architecture docs: 40 KB
  ├─ API documentation: 30 KB
  ├─ Feature guides: 50 KB
  └─ Other documentation: 30 KB

Diagrams: 15+
  ├─ System architecture: 5 diagrams
  ├─ Data flows: 5 diagrams
  ├─ Component diagrams: 3 diagrams
  └─ Database schemas: 2 diagrams

Code Examples: 50+
  ├─ API request/response: 20 examples
  ├─ Configuration: 10 examples
  ├─ Command line: 15 examples
  └─ Code snippets: 5 examples
```

---

## 🔧 Customization

### **Branding**
Update these files with your branding:
- `Home.md` - Logo and title
- `_Sidebar.md` - Navigation structure

### **Content**
Add new pages by creating .md files:
```markdown
# New Page Title

Your content here...

[Back to Home](Home)
```

### **Navigation**
Update `_Sidebar.md` to add new pages to navigation.

---

## 🎨 Formatting Guidelines

### **Page Title**
```markdown
# Page Title
```

### **Sections**
```markdown
## Section
### Subsection
#### Sub-subsection
```

### **Links**
```markdown
[Link Text](Page-Name)
```

### **Code Blocks**
````markdown
```language
code here
```
````

### **Tables**
```markdown
| Column 1 | Column 2 |
|----------|----------|
| Value 1  | Value 2  |
```

### **Diagrams**
```
┌─────────┐
│   Box   │
└────┬────┘
     │
     ▼
┌─────────┐
│   Box   │
└─────────┘
```

---

## ✅ Pre-Import Checklist

Before importing to your wiki:

- [ ] Review `Home.md` content
- [ ] Check `_Sidebar.md` navigation
- [ ] Verify all page links work
- [ ] Test code block formatting
- [ ] Review diagrams
- [ ] Check table rendering
- [ ] Customize branding (optional)
- [ ] Update project-specific info

---

## 📞 Support

### **Import Issues?**
1. Read [WIKI-IMPORT-GUIDE.md](WIKI-IMPORT-GUIDE.md)
2. Check platform-specific troubleshooting
3. Verify file structure matches wiki requirements

### **Formatting Issues?**
1. Check if your platform supports standard Markdown
2. Review platform-specific adjustments needed
3. Test with a single page first

### **Navigation Issues?**
1. Ensure `_Sidebar.md` exists
2. Check link syntax for your platform
3. Verify page names match file names

---

## 🔗 External Resources

- [GitHub Wiki Guide](https://docs.github.com/en/communities/documenting-your-project-with-wikis)
- [GitLab Wiki Guide](https://docs.gitlab.com/ee/user/project/wiki/)
- [Markdown Guide](https://www.markdownguide.org/)
- [Confluence Markdown](https://confluence.atlassian.com/doc/confluence-wiki-markup-251003035.html)

---

## 🎉 Ready to Import!

Your documentation is ready for import into any major wiki platform!

**Next Steps:**
1. Read [WIKI-IMPORT-GUIDE.md](WIKI-IMPORT-GUIDE.md)
2. Choose your platform
3. Follow import instructions
4. Enjoy your professional wiki! 🚀

---

**Last Updated:** 2025-01-18  
**Version:** 1.0  
**Status:** ✅ Ready for Import

