//** Very Bad Blog Post Retrieval Script
//** Created May 2025 From many hours on W3Schools, Stack Exchange, and one shameful session trouble shooiting with Ch*tGPT in an hour of weakness
$(document).ready(function() {
  $.ajax({
    url: 'posts.txt',
    dataType: 'text',
    success: function(data) {
      const posts = parsePosts(data);
      displayPosts(posts);
      populateFilters(posts);
    },
    error: function(xhr, status, error) {
      console.error("Error loading posts:", error);
    }
  });

  // Parse posts
  function parsePosts(data) {
    const rawPosts = data.split('---');
    return rawPosts.map(post => {
      const lines = post.trim().split('\n');
      const postObj = {};
      lines.forEach(line => {
        const [key, ...rest] = line.split(':');
        if (key) {
          postObj[key.trim().toLowerCase()] = rest.join(':').trim();
        }
      });
      return {
        title: postObj.title || 'Untitled',
        category: postObj.category || 'Uncategorized',
        tags: postObj.tags || '',
        content: postObj.content || 'No content available.',
      };
    });
  }

  // Display Posts
  function displayPosts(posts) {
    $('#blogPosts').empty();
    posts.forEach(post => {
      $('#blogPosts').append(`
        <div class="post" data-category="${post.category}" data-tags="${post.tags}">
          <h2>${post.title}</h2>
          <p>${post.content}</p>
          <br>
          <p><strong>Tags:</strong> ${post.tags}</p>
          <br>
          <br>
        </div>
      `);
    });
  }

// Populate Filters
function populateFilters(posts) {
  const categories = [...new Set(posts.map(post => post.category))];
  const tags = [...new Set(posts.flatMap(post => post.tags.split(',').map(tag => tag.trim())))];

  // Sort categories and tags alphabetically
  categories.sort((a, b) => a.localeCompare(b));
  tags.sort((a, b) => a.localeCompare(b));

  categories.forEach(category => {
    $('#categoryFilter').append(`<option value="${category}">${category}</option>`);
  });

  tags.forEach(tag => {
    $('#tagFilter').append(`<option value="${tag}">${tag}</option>`);
  });
}

  // Filter application
  $('#categoryFilter').on('change', applyFilters);
  $('#tagFilter').on('change', applyFilters);

  // Apply Filters to posts
  function applyFilters() {
    const selectedCategory = $('#categoryFilter').val();
    const selectedTag = $('#tagFilter').val();

    $('.post').each(function() {
      const postCategory = $(this).data('category');
      const postTags = $(this).data('tags').split(',').map(tag => tag.trim());

      const categoryMatch = !selectedCategory || postCategory === selectedCategory;
      const tagMatch = !selectedTag || postTags.includes(selectedTag);

      $(this).toggle(categoryMatch && tagMatch);
    });
  }
});
