// schema.js
const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList, GraphQLInt } = require('graphql');
const bcrypt = require('bcryptjs');

// Import your User and Post models here
const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        created_at: { type: GraphQLString },
        updated_at: { type: GraphQLString },
    }),
});

const PostType = new GraphQLObjectType({
    name: 'Post',
    fields: () => ({
        id: { type: GraphQLInt },
        title: { type: GraphQLString },
        content: { type: GraphQLString },
        author_id: { type: GraphQLInt },
        created_at: { type: GraphQLString },
        updated_at: { type: GraphQLString },
    }),
});

const CommentType = new GraphQLObjectType({
    name: 'Comment',
    fields: () => ({
        id: { type: GraphQLInt },
        content: { type: GraphQLString },
        created_at: { type: GraphQLString },
        updated_at: { type: GraphQLString },
        author_id: { type: GraphQLInt },
        post_id: { type: GraphQLInt },
    }),
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args, { user }) {
                if (!user) {
                    throw new Error('Authentication required');
                }
                return User.findAll();
            },
        },
        user: {
            type: UserType,
            args: { id: { type: GraphQLInt } },
            resolve(parent, args, { user }) {
                if (!user) {
                    throw new Error('Authentication required');
                }
                return User.findByPk(args.id);
            },
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args, { user }) {
                if (!user) {
                    throw new Error('Authentication required');
                }
                return Post.findAll();
            },
        },
        post: {
            type: PostType,
            args: { id: { type: GraphQLInt } },
            resolve(parent, args, { user }) {
                if (!user) {
                    throw new Error('Authentication required');
                }
                return Post.findByPk(args.id);
            },
        },
        comments: {
            type: new GraphQLList(CommentType),
            resolve(parent, args, { user }) {
                if (!user) {
                    throw new Error('Authentication required');
                }
                return Comment.findAll();
            },
        },
        comment: {
            type: CommentType,
            args: { id: { type: GraphQLInt } },
            resolve(parent, args, { user }) {
                if (!user) {
                    throw new Error('Authentication required');
                }
                return Comment.findByPk(args.id);
            },
        },
    },
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType,
            args: {
                name: { type: GraphQLString },
                email: { type: GraphQLString },
                password: { type: GraphQLString },
            },
            async resolve(parent, args, { user }) {
                if (!user) {
                    throw new Error('Authentication required');
                }
                try {
                    // Check if a user with the same email already exists
                    const existingUser = await User.findOne({ where: { email: args.email } });
                    if (existingUser) {
                        throw new Error('Email already in use');
                    }

                    // // Hash the user's password before creating the user
                    // const hashedPassword = await bcrypt.hash(args.password, 10); // Use the same salt rounds as in the model
                    // // Create a new user in the database
                    // const user = await User.create({...args, password: hashedPassword});

                    const user = await User.create(args);

                    return user;
                } catch (error) {
                    // Handle errors, log them, and potentially return an error message
                    console.error('Error adding user:', error);
                    throw error;
                }
            },
        },
        updateUser: {
            type: UserType,
            args: {
                id: { type: GraphQLInt },
                name: { type: GraphQLString },
                email: { type: GraphQLString },
                password: { type: GraphQLString },
            },
            async resolve(parent, args, { user }) {
                if (!user) {
                    throw new Error('Authentication required');
                }
                try {
                    // Find the existing user by ID
                    const userObj = await User.findByPk(args.id);

                    if (!userObj) {
                        throw new Error('User not found');
                    }

                    if(user.id !== userObj.id) {
                        throw new Error('You can only update your own profile');
                    }

                    // Check if a userObj with the same email already exists
                    if (args.email) {
                        const existingUser = await User.findOne({ where: { email: args.email } });
                        if (existingUser && existingUser.id !== args.id) {
                            throw new Error('Email already in use');
                        }
                    }

                    // Update the userObj's properties if provided
                    if (args.name !== undefined) {
                        userObj.name = args.name;
                    }

                    if (args.email !== undefined) {
                        userObj.email = args.email;
                    }

                    if (args.password !== undefined) {
                        userObj.password = args.password;
                    }

                    // Save the updated userObj to the database
                    await userObj.save();

                    return user;
                } catch (error) {
                    // Handle errors, log them, and potentially return an error message
                    console.error('Error updating user:', error);
                    throw error;
                }
            },
        },
        deleteUser: {
            type: UserType,
            args: { id: { type: GraphQLInt } },
            async resolve(parent, args, { user }) {
                if (!user) {
                    throw new Error('Authentication required');
                }
                try {
                    // Find the existing user by ID
                    const userObj = await User.findByPk(args.id);

                    if (!userObj) {
                        throw new Error('User not found');
                    }

                    if(user.id !== userObj.id) {
                        throw new Error('You can only delete your own profile');
                    }

                    // Delete the userObj from the database
                    await userObj.destroy();

                    return userObj;
                } catch (error) {
                    // Handle errors, log them, and potentially return an error message
                    console.error('Error deleting user:', error);
                    throw error;
                }
            },
        },


        createPost: {
            type: PostType,
            args: {
                title: { type: GraphQLString },
                content: { type: GraphQLString },
                author_id: { type: GraphQLInt },
            },
            async resolve(parent, args, { user }) {
                if (!user) {
                    throw new Error('Authentication required');
                }
                try {
                    // Ensure that the user (author) exists before creating a post
                    const user = await User.findByPk(args.author_id);

                    if (!user) {
                        throw new Error('Author not found');
                    }

                    // Create a new post in the database
                    const post = await Post.create({
                        title: args.title,
                        content: args.content,
                        author_id: args.author_id,
                    });

                    return post;
                } catch (error) {
                    // Handle errors, log them, and potentially return an error message
                    console.error('Error creating post:', error);
                    throw error;
                }
            },
        },
        updatePost: {
            type: PostType,
            args: {
                id: { type: GraphQLInt },
                title: { type: GraphQLString },
                content: { type: GraphQLString },
            },
            async resolve(parent, args, { user }) {
                if (!user) {
                    throw new Error('Authentication required');
                }
                try {
                    // Find the existing post by its ID
                    const post = await Post.findByPk(args.id);

                    if (!post) {
                        throw new Error('Post not found');
                    }

                    // Ensure that the user (author) exists before updating the post
                    const author = await User.findByPk(post.author_id);

                    if (!author) {
                        throw new Error('Author not found');
                    }

                    if(user.id !== post.author_id) {
                        throw new Error('You can only update your own posts');
                    }

                    // Update the post's properties if provided
                    if (args.title !== undefined) {
                        post.title = args.title;
                    }

                    if (args.content !== undefined) {
                        post.content = args.content;
                    }

                    // Save the updated post to the database
                    await post.save();

                    return post;
                } catch (error) {
                    // Handle errors, log them, and potentially return an error message
                    console.error('Error updating post:', error);
                    throw error;
                }
            },
        },
        deletePost: {
            type: PostType,
            args: { id: { type: GraphQLInt } },
            async resolve(parent, args, { user }) {
                if (!user) {
                    throw new Error('Authentication required');
                }
                try {
                    // Find the existing post by its ID
                    const post = await Post.findByPk(args.id);

                    if (!post) {
                        throw new Error('Post not found');
                    }

                    // Ensure that the user (author) exists before updating the post
                    const author = await User.findByPk(post.author_id);

                    if (!author) {
                        throw new Error('Author not found');
                    }

                    if(user.id !== post.author_id) {
                        throw new Error('You can only delete your own posts');
                    }

                    // Delete the post from the database
                    await post.destroy();

                    return post;
                } catch (error) {
                    // Handle errors, log them, and potentially return an error message
                    console.error('Error deleting post:', error);
                    throw error;
                }
            },
        },

        createComment: {
            type: CommentType,
            args: {
                content: { type: GraphQLString },
                author_id: { type: GraphQLInt },
                post_id: { type: GraphQLInt },
            },
            async resolve(parent, args, { user }) {
                if (!user) {
                    throw new Error('Authentication required');
                }
                try {
                    // Ensure that the user and post exist before creating a comment
                    const user = await User.findByPk(args.author_id);
                    const post = await Post.findByPk(args.post_id);

                    if (!user || !post) {
                        throw new Error('User or post not found');
                    }

                    // Create a new comment in the database
                    const comment = await Comment.create({
                        content: args.content,
                        author_id: args.author_id,
                        post_id: args.post_id,
                    });

                    return comment;
                } catch (error) {
                    // Handle errors, log them, and potentially return an error message
                    console.error('Error creating comment:', error);
                    throw error;
                }
            },
        },
        updateComment: {
            type: CommentType,
            args: {
                id: { type: GraphQLInt },
                content: { type: GraphQLString },
            },
            async resolve(parent, args, { user }) {
                if (!user) {
                    throw new Error('Authentication required');
                }
                try {
                    // Find the existing comment by its ID
                    const comment = await Comment.findByPk(args.id);

                    if (!comment) {
                        throw new Error('Comment not found');
                    }

                    // Ensure that the user (author) exists before updating the post
                    const author = await User.findByPk(comment.author_id);

                    if (!author) {
                        throw new Error('Author not found');
                    }

                    if(user.id !== comment.author_id) {
                        throw new Error('You can only update your own comments');
                    }

                    // Update the comment's content if provided
                    if (args.content !== undefined) {
                        comment.content = args.content;
                    }

                    // Save the updated comment to the database
                    await comment.save();

                    return comment;
                } catch (error) {
                    // Handle errors, log them, and potentially return an error message
                    console.error('Error updating comment:', error);
                    throw error;
                }
            },
        },
        deleteComment: {
            type: CommentType, // Return a confirmation message
            args: {
                id: { type: GraphQLInt },
            },
            async resolve(parent, args, { user }) {
                if (!user) {
                    throw new Error('Authentication required');
                }
                try {
                    // Find the existing comment by its ID
                    const comment = await Comment.findByPk(args.id);

                    if (!comment) {
                        throw new Error('Comment not found');
                    }

                    // Ensure that the user (author) exists before updating the post
                    const author = await User.findByPk(post.author_id);

                    if (!author) {
                        throw new Error('Author not found');
                    }

                    if(user.id !== comment.author_id) {
                        throw new Error('You can only delete your own comments');
                    }

                    // Delete the comment from the database
                    await comment.destroy();

                    // Return a confirmation message
                    return 'Comment deleted successfully';
                } catch (error) {
                    // Handle errors, log them, and potentially return an error message
                    console.error('Error deleting comment:', error);
                    throw error;
                }
            },
        },
    },
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});
