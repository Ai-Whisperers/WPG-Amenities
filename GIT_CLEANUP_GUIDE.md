# Git Repository Cleanup Guide

## Issue: Extensive Deleted Files in Git History

Your repository currently has **100+ deleted files** marked in git status that haven't been properly committed. These files are cluttering your git status and need to be cleaned up.

## Deleted Files Categories:

### 1. **Archive/Downloaded Website** (~60 files)
- Old downloaded website files
- Legacy images from previous version
- Old HTML catalog pages

### 2. **Public Images** (~50 files)
- Client logos (GIF format)
- Hero slides (PNG format)
- Layout images (footer, header)
- Product images (old GIFs)
- Miscellaneous images with spaces in names

### 3. **Scripts & Tests** (~15 files)
- Screenshot scripts
- Scraper scripts
- Test files
- Vite configuration

### 4. **Documentation** (~10 files)
- Old markdown files
- Image replacement guides
- Analysis documents

### 5. **Other Files**
- Login page
- Template files
- Sustainability page

## Cleanup Options:

### Option 1: Commit the Deletions (Recommended)
This preserves history while cleaning up the working directory.

```bash
# Stage all deleted files
git add -u

# Or stage specific directories
git add archive/
git add public/images/client-logos/
git add public/images/hero-slides/
git add scripts/
git add screenshots/

# Commit with descriptive message
git commit -m "Remove legacy files and unused assets

- Remove old downloaded website archive
- Clean up unused client logo GIFs
- Remove deprecated hero slide images
- Delete old scraper and screenshot scripts
- Clean up obsolete documentation files"
```

### Option 2: Reset to Clean State
If you want to unstage these deletions and keep files locally:

```bash
# Unstage all changes
git reset HEAD

# Or restore specific files/directories
git restore archive/
git restore public/images/
```

### Option 3: Clean Working Directory
If you're sure these files are not needed:

```bash
# Remove all untracked files (be careful!)
git clean -fd

# Preview what would be removed
git clean -fdn
```

## Recommended Action Plan:

1. **Review the deleted files**:
   ```bash
   git status | grep "^D" > deleted_files.txt
   ```

2. **Verify no important files are being deleted**:
   - Check if any client logos are still needed
   - Ensure no active product images are being removed
   - Confirm scripts aren't referenced anywhere

3. **Commit the deletions in logical groups**:
   ```bash
   # Commit archive files
   git add archive/
   git commit -m "Remove old downloaded website archive"

   # Commit old images
   git add public/images/client-logos/ public/images/hero-slides/
   git commit -m "Remove legacy image assets"

   # Commit scripts and tests
   git add scripts/ tests/ vite.config.js
   git commit -m "Remove deprecated scripts and test files"

   # Commit documentation
   git add *.md
   git commit -m "Clean up obsolete documentation"
   ```

4. **Update .gitignore** to prevent future issues:
   ```gitignore
   # Archives
   archive/
   
   # Old assets
   *.gif
   *_old.*
   
   # Scripts
   scripts/deprecated/
   
   # Screenshots
   screenshots/
   ```

## After Cleanup:

1. **Verify clean status**:
   ```bash
   git status
   ```

2. **Check repository size**:
   ```bash
   git count-objects -vH
   ```

3. **Consider using Git LFS** for large files if needed:
   ```bash
   git lfs track "*.png"
   git lfs track "*.jpg"
   ```

## Prevention Tips:

1. **Regular cleanup**: Don't let deleted files accumulate
2. **Use feature branches**: Keep main branch clean
3. **Review before committing**: Use `git status` frequently
4. **Update .gitignore**: Add patterns for files you don't want tracked
5. **Use git clean periodically**: Remove untracked files

## Important Notes:

- These files are already deleted from your working directory
- They're just waiting to be committed to git
- Once committed, they'll still exist in git history
- To completely remove from history, you'd need `git filter-branch` or BFG Repo-Cleaner

## Quick Command to Stage All Deletions:

```bash
git ls-files --deleted | xargs git add
```

Or simply:
```bash
git add -A
git commit -m "Major cleanup: Remove legacy files and unused assets"
```

This will clean up your git status and make your repository much cleaner!