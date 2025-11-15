import React from 'react';
import { BlogPost } from '../types';
import { Button } from '../components/ui/Button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const mockBlogPosts: BlogPost[] = [
    {
        id: '1',
        title: 'The Ultimate Guide to Choosing Your Next Laptop',
        description: 'In this comprehensive guide, we walk you through everything you need to consider when buying a new laptop, from performance to portability.',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop',
        author: {
            name: 'Alex Johnson',
            avatar: 'https://i.pravatar.cc/150?u=alexjohnson',
        },
        date: 'October 26, 2025',
        featured: true,
    },
    {
        id: '2',
        title: '5 Timeless Jewelry Pieces Every Woman Should Own',
        description: 'Discover the essential jewelry items that will elevate any outfit, from classic diamond studs to a versatile statement necklace.',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1964&auto=format&fit=crop',
        author: {
            name: 'Samantha Carter',
            avatar: 'https://i.pravatar.cc/150?u=samanthacarter',
        },
        date: 'October 22, 2025',
    },
    {
        id: '3',
        title: 'Men’s Fashion: Mastering the Smart-Casual Look',
        description: 'Struggling to nail the smart-casual dress code? We break down the key components to help you look sharp and feel comfortable.',
        image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1887&auto=format&fit=crop',
        author: {
            name: 'David Chen',
            avatar: 'https://i.pravatar.cc/150?u=davidchen',
        },
        date: 'October 18, 2025',
    },
    {
        id: '4',
        title: 'A Guide to Sustainable and Ethical Fashion',
        description: 'Learn how to make more conscious choices when building your wardrobe without sacrificing style. Your closet and the planet will thank you.',
        image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=2070&auto=format&fit=crop',
        author: {
            name: 'Maria Garcia',
            avatar: 'https://i.pravatar.cc/150?u=mariagarcia',
        },
        date: 'October 15, 2025',
    }
];


const FeaturedPost: React.FC<{ post: BlogPost }> = ({ post }) => (
  <section className="bg-brand-gray-light">
    <div className="container mx-auto px-6 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1">
          <p className="font-semibold text-brand-yellow uppercase tracking-wider mb-2">Featured Article</p>
          <h1 className="font-heading text-4xl md:text-5xl mb-4">{post.title}</h1>
          <p className="text-brand-black/70 mb-6">{post.description}</p>
          <div className="flex items-center gap-4 mb-8">
            <img src={post.author.avatar} alt={post.author.name} className="w-12 h-12 rounded-full" />
            <div>
              <p className="font-semibold">{post.author.name}</p>
              <p className="text-sm text-brand-black/60">{post.date}</p>
            </div>
          </div>
          <Button asChild variant="outline">
            <Link to="#">Read More <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="order-1 lg:order-2 h-96 lg:h-[500px]">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover rounded-lg shadow-lg" />
        </div>
      </div>
    </div>
  </section>
);

const BlogPostCard: React.FC<{ post: BlogPost }> = ({ post }) => (
  <Link to="#" className="group flex flex-col">
    <div className="aspect-video overflow-hidden bg-brand-gray-light mb-4">
      <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
    </div>
    <h2 className="font-heading text-xl mb-2 flex-grow">{post.title}</h2>
    <p className="text-sm text-brand-black/70 mb-4">{post.description.substring(0, 100)}...</p>
    <div className="flex items-center gap-3 text-sm mt-auto">
      <img src={post.author.avatar} alt={post.author.name} className="w-8 h-8 rounded-full" />
      <div>
        <p className="font-semibold">{post.author.name}</p>
        <p className="text-brand-black/60">{post.date}</p>
      </div>
    </div>
  </Link>
);


const BlogPage = () => {
  const featuredPost = mockBlogPosts.find(p => p.featured);
  const otherPosts = mockBlogPosts.filter(p => !p.featured);

  return (
    <div className="bg-brand-white">
      {featuredPost && <FeaturedPost post={featuredPost} />}
      
      <main className="container mx-auto px-6 py-16">
        <h2 className="font-heading text-4xl text-center mb-12">More Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {otherPosts.map(post => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default BlogPage;
