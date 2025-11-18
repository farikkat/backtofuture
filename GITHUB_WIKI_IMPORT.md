# GitHub Wiki Import Instructions

## 🚀 Quick Import Guide

Follow these steps to import your documentation to GitHub Wiki.

---

## 📋 Prerequisites

1. **GitHub Repository**: You need a GitHub repository (this one: `backtofuture`)
2. **Git Installed**: Make sure Git is installed on your computer
3. **GitHub Access**: You need push access to your repository

---

## 🔧 Step-by-Step Instructions

### **Step 1: Create the Wiki (if it doesn't exist)**

1. Go to your GitHub repository:
   ```
   https://github.com/YOUR_USERNAME/backtofuture
   ```

2. Click the **"Wiki"** tab at the top

3. If the wiki doesn't exist, click **"Create the first page"**
   - Title: "Home"
   - Content: "Documentation"
   - Click **"Save Page"**

4. Now your wiki exists and you can clone it!

---

### **Step 2: Clone the Wiki Repository**

Open your terminal and run:

```bash
# Navigate to a location where you want to clone the wiki
cd C:\Users\ftrhack142

# Clone your wiki repository
# Replace YOUR_USERNAME with your GitHub username
git clone https://github.com/YOUR_USERNAME/backtofuture.wiki.git
```

**Example:**
```bash
git clone https://github.com/johndoe/backtofuture.wiki.git
```

---

### **Step 3: Copy Wiki Files**

```bash
# Navigate back to your project
cd C:\Users\ftrhack142\backtofuture

# Copy all wiki files to the wiki repository
# Windows PowerShell:
Copy-Item -Path wiki\* -Destination ..\backtofuture.wiki\ -Recurse -Force

# OR Windows Command Prompt:
xcopy wiki\* ..\backtofuture.wiki\ /E /H /Y

# OR Git Bash:
cp -r wiki/* ../backtofuture.wiki/
```

---

### **Step 4: Commit and Push**

```bash
# Navigate to the wiki repository
cd ..\backtofuture.wiki

# Check what files were copied
git status

# Add all files
git add .

# Commit the changes
git commit -m "Import complete documentation with architecture, API reference, and guides"

# Push to GitHub
git push origin master
```

---

### **Step 5: Verify on GitHub**

1. Go to your wiki:
   ```
   https://github.com/YOUR_USERNAME/backtofuture/wiki
   ```

2. You should see:
   - ✅ **Home page** with complete navigation
   - ✅ **Sidebar** on the right with all sections
   - ✅ All pages accessible through navigation

3. Test the links:
   - Click on "Architecture Overview"
   - Click on "API Reference"
   - Navigate through the sidebar

---

## 📝 Alternative: Single Command (PowerShell)

If you want to do everything in one go:

```powershell
# From your backtofuture directory
cd C:\Users\ftrhack142

# Clone wiki (replace YOUR_USERNAME)
git clone https://github.com/YOUR_USERNAME/backtofuture.wiki.git

# Copy files
Copy-Item -Path backtofuture\wiki\* -Destination backtofuture.wiki\ -Recurse -Force

# Commit and push
cd backtofuture.wiki
git add .
git commit -m "Import complete documentation"
git push origin master

# Done!
Write-Host "✅ Documentation imported successfully!"
Write-Host "Visit: https://github.com/YOUR_USERNAME/backtofuture/wiki"
```

---

## 🎯 What You'll Get

After import, your GitHub Wiki will have:

### **Home Page**
- Welcome message
- Quick Start section
- Documentation sections (Architecture, API, Features, etc.)
- Common tasks
- System information

### **Sidebar Navigation**
- 📚 Quick Start
- 🏗️ Architecture (6 sections)
- 🔌 API Reference (4 APIs)
- 💡 Features (6 features)
- 🗄️ Database (4 guides)
- 🛠️ Development (4 guides)
- 🚀 Deployment (3 guides)
- 🆘 Support (3 guides)

### **Pages**
- Architecture Overview
- API Reference (11 endpoints)
- Data Flow Diagrams
- And more...

---

## ⚠️ Troubleshooting

### **Issue: Wiki doesn't exist**
**Solution:**
1. Go to your GitHub repository
2. Click "Wiki" tab
3. Click "Create the first page"
4. Save it
5. Now you can clone it

### **Issue: Git clone fails**
**Error:** `Repository not found`

**Solution:**
- Check your GitHub username in the URL
- Make sure you have access to the repository
- Ensure the wiki has been created (see above)

### **Issue: Permission denied**
**Error:** `Permission denied (publickey)`

**Solution:**
- Make sure you're logged into Git: `git config --global user.name "Your Name"`
- Set up SSH keys: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
- Or use HTTPS URL instead

### **Issue: Copy command not working**
**Solution:**
- Make sure paths are correct
- Try using absolute paths
- Check that wiki/ folder exists in your project

---

## ✅ Verification Checklist

After import, check these:

- [ ] Home page loads: `https://github.com/YOUR_USERNAME/backtofuture/wiki`
- [ ] Sidebar appears on the right side
- [ ] "Architecture Overview" link works
- [ ] "API Reference" link works
- [ ] All navigation links work
- [ ] Code blocks render properly
- [ ] Diagrams display correctly
- [ ] Tables format nicely

---

## 🎨 Customization (Optional)

After import, you can customize:

### **Update Home Page**
1. Go to wiki
2. Click "Home" page
3. Click "Edit" button
4. Make your changes
5. Click "Save"

### **Add New Pages**
1. Click "New Page" in wiki
2. Enter page title
3. Write content in Markdown
4. Click "Save"
5. Add link to sidebar by editing `_Sidebar.md`

### **Edit Sidebar**
1. Find `_Sidebar.md` page in wiki
2. Click "Edit"
3. Add/remove/reorder links
4. Click "Save"

---

## 🔗 Your Wiki URLs

After import, your documentation will be at:

```
Home:
https://github.com/YOUR_USERNAME/backtofuture/wiki

Architecture:
https://github.com/YOUR_USERNAME/backtofuture/wiki/Architecture-Overview

API Reference:
https://github.com/YOUR_USERNAME/backtofuture/wiki/API-Reference

Data Flows:
https://github.com/YOUR_USERNAME/backtofuture/wiki/Data-Flow-Diagrams
```

---

## 📞 Need Help?

1. **GitHub Wiki Documentation**
   https://docs.github.com/en/communities/documenting-your-project-with-wikis

2. **Markdown Guide**
   https://www.markdownguide.org/

3. **Check Files**
   - Make sure all .md files are in wiki/ folder
   - Verify Home.md and _Sidebar.md exist
   - Check that file names match link targets

---

## 🎉 Success!

Once completed, you'll have a **professional, searchable wiki** with:
- ✅ Complete architecture documentation
- ✅ Full API reference
- ✅ Data flow diagrams
- ✅ Easy navigation
- ✅ Mobile-friendly
- ✅ Searchable content
- ✅ Version controlled

**Share it with your team!** 🚀

---

**Last Updated:** 2025-01-18  
**Version:** 1.0  
**Status:** ✅ Ready to Import

