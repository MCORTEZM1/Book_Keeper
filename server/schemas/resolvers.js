const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        // use me to verify user is logged in 
        me: async (parent, args, context) => {
            // if context.user exists, return the userData
            if(context.user) {
                const userData = await User.findOne({ _id: context.user._id })


                return userData;
            }
            
            // if no context.user exists, we know that the user is not authenticated
            throw new AuthenticationError('Not logged in');
        }
    },
    Mutation: {
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            if(!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);
            if(!correctPw){
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);
            return  { token, user};
        },
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            // return token and user: token is required in Auth typeDefs
            return { token, user };
        },
        saveBook: async (parent, args , context) => {
            if (context.user) { 
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedBooks: args }},
                    { new: true }
                );

                return updatedUser;
            }
            throw new AuthenticationError('You need to be logged in to save a book');
        },
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId } }},
                    { new: true }
                );

                return updatedUser;
            }

            throw new AuthenticationError('Please log in');
        }
    }
}

module.exports = resolvers;