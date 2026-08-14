# Video Categories Implementation Plan

Based on your request, you want the Video sections (Long Form & Short Form) on the homepage to display **Categories** (like Podcast, Documentary) instead of individual videos. When a visitor clicks a Category, it will take them to a new page showing all the videos (with their thumbnails and links) that belong to that category.

I have reviewed the current architecture, and I have a clean and efficient plan to implement this.

## Proposed Changes

We can achieve this beautifully without needing to completely rebuild your database. Here is how:

1. **Repurpose the "Label" Field as "Category"**
   - In the Admin Dashboard's "Manage Video Projects" tab, you currently have an optional field called `Special Label (Optional)`. We will rename this in the UI to `Video Category (e.g. Podcast, Documentary)`.
   - When you add a new video (e.g., "Podcast Episode 1"), you simply type "Podcast" into this category field.

2. **Update the Homepage (Index)**
   - The homepage will automatically scan all your videos and group them by this category name.
   - It will display a single, beautiful card for "Podcast", using the thumbnail of the most recent video you uploaded to that category.
   
3. **Create a new `VideoCategoryPage`**
   - When a user clicks the "Podcast" card on the homepage, they will be taken to `/video-category/Podcast`.
   - This new page will look similar to the photography gallery page. It will have a large title "Podcast" at the top, and will display a grid of all the video thumbnails belonging to that category.
   - Clicking a video thumbnail on this page will open its associated YouTube link (or play it directly).

## Open Questions

> [!IMPORTANT]
> **Question 1: Category Cover Images**
> By default, the homepage card for "Podcast" will simply use the thumbnail of the first video inside that category. Is this acceptable, or do you strictly need the ability to upload a *separate, dedicated cover image* just for the category card itself? (Using the first video's thumbnail is much faster to build and avoids database schema changes).

> [!IMPORTANT]
> **Question 2: Viewing the Videos**
> On the new category page (e.g., the Podcast page), when a user clicks a video thumbnail, should it open the YouTube link in a new tab, or should we try to embed it? (Opening in a new tab is the most reliable).

Please review this plan. If you are happy with this approach and provide answers to the open questions, I will proceed with the execution immediately!