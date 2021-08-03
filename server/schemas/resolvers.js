const { AuthenticationError } = require("apollo-server-express");
const { User, Book } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  //Query functions
  Query: {
    // users: async () => {
    //   return User.find().populate("books");
    // },
    // user: async (parent, { userId }) => {
    //   return User.findOne({ _id: userId }).populate("books");
    // },
    // books: async (parent, { username }) => {
    //   const params = username ? { username } : {};
    //   return Book.find(params).sort({ createdAt: -1 });
    // },
    // book: async (parent, { bookId }) => {
    //   return Book.findOne({ _id: bookId });
    // },
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate("books");
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
  //Mutation functions
  Mutation: {
    //Function for adding a user
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    //function for login
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("No user found with this email address");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);

      return { token, user };
    },
    // function for saving a book
    saveBook: async (parent, { description }, context) => {
      if (context.user) {
        const book = await User.findByIdAndUpdate(
          {_id:context.user._id},
          {$push: { savedBooks: description }},
          {new: true}
          
        );
        
        return book;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    //function for removing a book
    removeBook: async (parent, { book }, context) => {
      if (context.user) {
        return User.findOneAndUpdate(
          {_id: context.user._id},
          { $pull: { savedBooks: book }},
          { new: true}
          
        );
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

module.exports = resolvers;
