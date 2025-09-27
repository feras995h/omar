// Database Connection Test
import { db } from './database';

async function testDatabase() {
  console.log('🧪 Testing database connection and operations...\n');

  try {
    // Get database status
    const status = await db.getStatus();
    console.log('📊 Database Status:', status);

    // Test Categories
    console.log('\n📂 Testing Categories...');
    const categories = await db.getAllCategories();
    console.log(`Found ${categories.length} categories`);

    if (categories.length === 0) {
      console.log('Creating sample category...');
      const newCategory = await db.createCategory({
        name: 'تجربة',
        slug: 'test',
        description: 'فئة تجريبية',
        color: '#3B82F6'
      });
      console.log('✅ Created category:', newCategory.name);
    }

    // Test Users
    console.log('\n👥 Testing Users...');
    const users = await db.getAllUsers();
    console.log(`Found ${users.length} users`);

    if (users.length === 0) {
      console.log('Creating sample user...');
      const newUser = await db.createUser({
        email: 'test@example.com',
        name: 'مستخدم تجريبي',
        role: 'USER',
        password: 'test123'
      });
      console.log('✅ Created user:', newUser.name);
    }

    // Test Posts
    console.log('\n📝 Testing Posts...');
    const posts = await db.getAllPosts();
    console.log(`Found ${posts.length} posts`);

    const publishedPosts = await db.getPublishedPosts();
    console.log(`Found ${publishedPosts.length} published posts`);

    if (posts.length === 0) {
      const allUsers = await db.getAllUsers();
      const allCategories = await db.getAllCategories();
      
      if (allUsers.length > 0 && allCategories.length > 0) {
        console.log('Creating sample post...');
        const newPost = await db.createPost({
          title: 'مقال تجريبي',
          content: 'هذا مقال تجريبي لاختبار النظام',
          excerpt: 'مقال تجريبي',
          slug: 'test-post',
          status: 'PUBLISHED',
          publishedAt: new Date().toISOString(),
          authorId: allUsers[0].id,
          categories: [allCategories[0].id]
        });
        console.log('✅ Created post:', newPost.title);
      }
    }

    // Test Comments
    console.log('\n💬 Testing Comments...');
    const allPosts = await db.getAllPosts();
    if (allPosts.length > 0) {
      const comments = await db.getCommentsByPostId(allPosts[0].id);
      console.log(`Found ${comments.length} comments for post: ${allPosts[0].title}`);

      if (comments.length === 0) {
        const allUsers = await db.getAllUsers();
        if (allUsers.length > 0) {
          console.log('Creating sample comment...');
          const newComment = await db.createComment({
            content: 'تعليق تجريبي رائع!',
            authorId: allUsers[0].id,
            postId: allPosts[0].id
          });
          console.log('✅ Created comment:', newComment.content);
        }
      }
    }

    // Test Contacts
    console.log('\n📞 Testing Contacts...');
    const contacts = await db.getAllContacts();
    console.log(`Found ${contacts.length} contacts`);

    if (contacts.length === 0) {
      console.log('Creating sample contact...');
      const newContact = await db.createContact({
        name: 'أحمد محمد',
        email: 'ahmed@example.com',
        phone: '+966501234567',
        subject: 'استفسار تجريبي',
        message: 'هذا استفسار تجريبي لاختبار النظام',
        status: 'PENDING'
      });
      console.log('✅ Created contact:', newContact.name);
    }

    // Test Newsletter
    console.log('\n📧 Testing Newsletter...');
    const newsletters = await db.getAllNewsletterSubscriptions();
    console.log(`Found ${newsletters.length} newsletter subscriptions`);

    if (newsletters.length === 0) {
      console.log('Creating sample newsletter subscription...');
      const newNewsletter = await db.createNewsletterSubscription({
        email: 'newsletter@example.com',
        name: 'مشترك تجريبي',
        isActive: true
      });
      console.log('✅ Created newsletter subscription:', newNewsletter.email);
    }

    // Export data test
    console.log('\n📤 Testing Data Export...');
    const exportedData = await db.exportData();
    console.log(`Exported data size: ${exportedData.length} characters`);

    console.log('\n✅ All database tests completed successfully!');
    console.log('\n📊 Final Summary:');
    console.log(`- Database Type: ${status.type}`);
    console.log(`- Categories: ${(await db.getAllCategories()).length}`);
    console.log(`- Users: ${(await db.getAllUsers()).length}`);
    console.log(`- Posts: ${(await db.getAllPosts()).length}`);
    console.log(`- Published Posts: ${(await db.getPublishedPosts()).length}`);
    console.log(`- Contacts: ${(await db.getAllContacts()).length}`);
    console.log(`- Newsletter Subscriptions: ${(await db.getAllNewsletterSubscriptions()).length}`);

  } catch (error) {
    console.error('❌ Database test failed:', error);
  }
}

// Run test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testDatabase();
}

export { testDatabase };