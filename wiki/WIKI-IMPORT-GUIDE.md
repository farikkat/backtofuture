# Wiki Import Guide

## 📚 How to Import Documentation into Wiki

This guide explains how to import the documentation into popular wiki platforms.

---

## 📁 Wiki Structure

The documentation is organized as follows:

```
wiki/
├── Home.md                      # Wiki home page
├── _Sidebar.md                  # Navigation sidebar
├── Architecture-Overview.md     # System architecture
├── API-Reference.md             # Complete API docs
├── Data-Flow-Diagrams.md        # Data flow visuals
└── [more pages...]
```

---

## 🌐 Supported Wiki Platforms

### **1. GitHub Wiki** ⭐ Recommended

GitHub Wiki automatically renders Markdown files and supports the wiki structure we've created.

#### **Import Steps:**

1. **Navigate to your GitHub repository**
   ```
   https://github.com/YOUR_USERNAME/YOUR_REPO
   ```

2. **Go to Wiki tab**
   - Click "Wiki" in the repository menu
   - If wiki doesn't exist, click "Create the first page"

3. **Clone the wiki repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO.wiki.git
   ```

4. **Copy wiki files**
   ```bash
   # Copy all files from wiki/ folder to the cloned wiki repo
   cp -r wiki/* YOUR_REPO.wiki/
   ```

5. **Commit and push**
   ```bash
   cd YOUR_REPO.wiki
   git add .
   git commit -m "Import complete documentation"
   git push origin master
   ```

6. **Done!** 🎉
   - Visit: `https://github.com/YOUR_USERNAME/YOUR_REPO/wiki`
   - Home page will display automatically
   - Sidebar navigation will appear

---

### **2. GitLab Wiki**

GitLab Wiki also uses Markdown and has similar structure to GitHub.

#### **Import Steps:**

1. **Go to your GitLab project**
   ```
   https://gitlab.com/YOUR_USERNAME/YOUR_PROJECT
   ```

2. **Navigate to Wiki**
   - Click "Wiki" in the left sidebar
   - Click "Create your first page" if needed

3. **Clone wiki repository**
   ```bash
   git clone https://gitlab.com/YOUR_USERNAME/YOUR_PROJECT.wiki.git
   ```

4. **Copy files**
   ```bash
   cp -r wiki/* YOUR_PROJECT.wiki/
   ```

5. **Commit and push**
   ```bash
   cd YOUR_PROJECT.wiki
   git add .
   git commit -m "Import documentation"
   git push origin master
   ```

---

### **3. Confluence**

Atlassian Confluence requires converting Markdown to Confluence format.

#### **Option A: Manual Import**

1. **Create Space**
   - Go to Confluence
   - Create a new space called "AI Voice Retention Agent"

2. **Create Pages**
   - Create a page for each .md file
   - Copy-paste content
   - Confluence will auto-convert some Markdown

3. **Fix Formatting**
   - Adjust code blocks (use `{code}` macro)
   - Fix links (use `[Page Title]`)
   - Adjust diagrams as needed

#### **Option B: Using Confluence Markdown Importer**

1. **Install Plugin**
   - Install "Markdown Importer" plugin in Confluence
   - Available in Atlassian Marketplace

2. **Bulk Import**
   - Use plugin to import all .md files
   - Plugin will create pages automatically
   - Review and adjust formatting

---

### **4. Notion**

Notion supports Markdown import natively.

#### **Import Steps:**

1. **Create New Page**
   - Open Notion
   - Create a page called "AI Voice Retention Agent"

2. **Import Markdown Files**
   - Click "..." menu → Import → Markdown
   - Select all .md files from wiki/ folder
   - Notion will create sub-pages automatically

3. **Organize Structure**
   - Drag pages to organize hierarchy
   - Set Home.md as the main page
   - Create sidebar with links

---

### **5. Azure DevOps Wiki**

Azure DevOps has built-in wiki support with Markdown.

#### **Import Steps:**

1. **Navigate to Project Wiki**
   ```
   https://dev.azure.com/YOUR_ORG/YOUR_PROJECT/_wiki
   ```

2. **Clone Wiki Repository**
   - Click "Clone wiki" button
   - Copy git URL
   ```bash
   git clone https://dev.azure.com/YOUR_ORG/YOUR_PROJECT/_wiki
   ```

3. **Copy Files**
   ```bash
   cp -r wiki/* YOUR_PROJECT/_wiki/
   ```

4. **Commit and Push**
   ```bash
   cd YOUR_PROJECT/_wiki
   git add .
   git commit -m "Import documentation"
   git push
   ```

---

## 🔧 Platform-Specific Adjustments

### **GitHub/GitLab Wiki**
✅ **Works out of the box!**
- Markdown renders perfectly
- Sidebar navigation supported
- Internal links work automatically

### **Confluence**
⚠️ **Requires adjustments:**
- Convert code blocks to `{code}` macros
- Use Confluence-style links: `[Page Title]`
- Adjust diagrams (may need to use Confluence diagrams)

### **Notion**
✅ **Mostly works:**
- Markdown imports well
- May need to adjust some formatting
- Tables and code blocks render nicely

### **Azure DevOps**
✅ **Good support:**
- Markdown renders well
- Supports most features
- May need to adjust internal links

---

## 📝 Link Syntax by Platform

### **GitHub/GitLab/Azure DevOps**
```markdown
[Link Text](Page-Name)
```

### **Confluence**
```
[Page Title]
or
[Link Text|Page Title]
```

### **Notion**
```markdown
[Link Text](Page Name)
```

---

## 🎨 Formatting Tips

### **Code Blocks**
All platforms support fenced code blocks:
````markdown
```javascript
const example = "code";
```
````

### **Tables**
All platforms support Markdown tables:
```markdown
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
```

### **Diagrams**
ASCII diagrams work best across all platforms:
```
┌─────────┐
│  Box 1  │
└────┬────┘
     │
     ▼
┌─────────┐
│  Box 2  │
└─────────┘
```

---

## ✅ Import Checklist

Before importing, make sure:

- [ ] All .md files are in the wiki/ folder
- [ ] Home.md exists as the main page
- [ ] _Sidebar.md exists for navigation
- [ ] All internal links use correct syntax
- [ ] Code blocks are properly formatted
- [ ] Tables render correctly
- [ ] Diagrams are readable

After importing:

- [ ] Check home page loads
- [ ] Test navigation links
- [ ] Verify all pages are accessible
- [ ] Check code block formatting
- [ ] Test search functionality
- [ ] Review on mobile (if applicable)

---

## 🚀 Quick Import Commands

### **GitHub Wiki**
```bash
# Clone wiki
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.wiki.git

# Copy files
cp -r wiki/* YOUR_REPO.wiki/

# Push to GitHub
cd YOUR_REPO.wiki
git add .
git commit -m "Import documentation"
git push origin master
```

### **GitLab Wiki**
```bash
# Clone wiki
git clone https://gitlab.com/YOUR_USERNAME/YOUR_PROJECT.wiki.git

# Copy files
cp -r wiki/* YOUR_PROJECT.wiki/

# Push to GitLab
cd YOUR_PROJECT.wiki
git add .
git commit -m "Import documentation"
git push origin master
```

---

## 📞 Troubleshooting

### **Links not working**
- Check link syntax for your platform
- Ensure page names match exactly
- Remove .md extension from links (some platforms)

### **Sidebar not showing**
- Ensure _Sidebar.md exists
- Check sidebar syntax for your platform
- Some platforms require manual sidebar creation

### **Code blocks not rendering**
- Use fenced code blocks (```)
- Specify language after opening fence
- Check platform-specific code block syntax

### **Diagrams look broken**
- ASCII diagrams work best
- Use monospace font
- Consider platform-specific diagram tools

---

## 💡 Best Practices

1. **Keep links relative**
   - Use `[Text](Page-Name)` not full URLs
   - Makes wiki portable across platforms

2. **Test on target platform**
   - Import a single page first
   - Check formatting and links
   - Adjust template if needed

3. **Maintain structure**
   - Keep folder organization
   - Preserve file naming convention
   - Maintain consistent navigation

4. **Update regularly**
   - Keep wiki in sync with code
   - Update diagrams when architecture changes
   - Add new pages as features are added

---

## 🎯 Recommended Platform

**For this project, we recommend: GitHub Wiki** ⭐

**Why:**
- ✅ Seamless Markdown support
- ✅ Automatic sidebar navigation
- ✅ Built-in search
- ✅ Version control (Git)
- ✅ Free for public repositories
- ✅ Easy collaboration
- ✅ Mobile-friendly
- ✅ No additional plugins needed

---

## 🔗 Additional Resources

- [GitHub Wiki Documentation](https://docs.github.com/en/communities/documenting-your-project-with-wikis)
- [GitLab Wiki Documentation](https://docs.gitlab.com/ee/user/project/wiki/)
- [Confluence Documentation](https://www.atlassian.com/software/confluence)
- [Notion Import Guide](https://www.notion.so/help/import-data)
- [Azure DevOps Wiki](https://docs.microsoft.com/en-us/azure/devops/project/wiki/)

---

## ✨ Summary

1. **Choose your wiki platform** (GitHub Wiki recommended)
2. **Clone the wiki repository**
3. **Copy all files from wiki/ folder**
4. **Commit and push**
5. **Verify everything works**

That's it! Your complete documentation is now in a wiki! 🎉

---

**Back to:** [Home](Home)

