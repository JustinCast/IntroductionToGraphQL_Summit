const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = require("graphql");
const axios = require("axios");

// note type
const NoteType = new GraphQLObjectType({
  name: "Note",
  fields: () => ({
    id: {type:GraphQLString},
    title: { type: GraphQLString },
    body: { type: GraphQLString },
    author: { type: GraphQLString },
    created_at: { type: GraphQLString }
  })
});

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    notes: {
      type: new GraphQLList(NoteType),
      resolve() {
        return axios
          .get("http://localhost:3000/notes")
          .then(notes => notes.data);
      }
    },
    singleNote: {
      type: NoteType,
      args: {
        id: { type: GraphQLString }
      },
      resolve(parent, args) {
        return axios
          .get(`http://localhost:3000/notes/${args.id}`)
          .then(note => note.data);
      }
    }
  }
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addNote: {
      type: NoteType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        body: { type: new GraphQLNonNull(GraphQLString) },
        author: { type: new GraphQLNonNull(GraphQLString) },
        created_at: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        return axios
          .post("http://localhost:3000/notes", {
            title: args.title,
            body: args.body,
            author: args.author,
            created_at: new Date()
          })
          .then(note => note.data);
      }
    },
    editNote: {
      type: NoteType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        title: { type: GraphQLString },
        body: { type: GraphQLString },
        author: { type: GraphQLString },
        created_at: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        return axios
          .put(`http://localhost:3000/notes/${args.id}`, args)
          .then(notes => notes.data);
      }
    },
    deleteNote: {
      type: NoteType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parentValue, args) {
        return axios
          .delete(`http://localhost:3000/notes/${args.id}`)
          .then(notes => notes.data);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: mutation
});
