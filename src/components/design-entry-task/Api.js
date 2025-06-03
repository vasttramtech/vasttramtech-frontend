// import axios from "axios";
// const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;
// const api = {
//   async getBoards(token) {
//     try {
//       const res = await axios.get(`${BASE_URL}/custom/boards`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return res.data;
//     } catch (error) {
//       console.log(error);
//       return [];
//     }
//   },

//   async getBoard(id, token) {
//     try {
//       const res = await axios.get(`${BASE_URL}/custom/boards/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return res.data;
//     } catch (error) {
//       console.log(error);
//       return null;
//     }
//   },

//   async createBoard(data, token) {
//     try {
//       const res = await axios.post(`${BASE_URL}/custom/boards`, data, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return res.data;
//     } catch (error) {
//       console.log(error);
//       return null;
//     }
//   },

//   async updateBoard(id, data, token) {
//     try {
//       const res = await axios.put(`${BASE_URL}/custom/boards/${id}`, data, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return res.data;
//     } catch (error) {
//       console.log(error);
//       return null;
//     }
//   },

//   async deleteBoard(id, token) {
//     try {
//       const res = await axios.delete(`${BASE_URL}/custom/boards/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return res.status === 200;
//     } catch (error) {
//       console.log(error);
//       return false;
//     }
//   },

//   async createColumn(data, token) {
//     try {
//       const res = await axios.post(`${BASE_URL}/custom/columns`, data, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return res.data;
//     } catch (error) {
//       console.log(error);
//       return null;
//     }
//   },

//   async updateColumn(id, data, token) {
//     try {
//       const res = await axios.put(`${BASE_URL}/custom/columns/${id}`, data, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return res.data;
//     } catch (error) {
//       console.log(error);
//       return null;
//     }
//   },

//   async deleteColumn(id, token) {
//     try {
//       const res = await axios.delete(`${BASE_URL}/custom/columns/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return res.status === 200;
//     } catch (error) {
//       console.log(error);
//       return false;
//     }
//   },

//   async createTask(data, token) {
//     try {
//       const res = await axios.post(`${BASE_URL}/task-design/create`, data, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return res.data;
//     } catch (error) {
//       console.log(error);
//       return null;
//     }
//   },

//   async updateTask(id, data, token) {
//     try {
//       const res = await axios.put(
//         `${BASE_URL}/task-design/update/${id}`,
//         data,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       return res.data;
//     } catch (error) {
//       console.log(error);
//       return null;
//     }
//   },

//   async deleteTask(id, token) {
//     try {
//       const res = await axios.delete(`${BASE_URL}/task-design/remove/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return res.status === 200;
//     } catch (error) {
//       console.log(error);
//       return false;
//     }
//   },

//   async moveTask(data, token) {
//     try {
//       const res = await axios.put(`${BASE_URL}/task-design/move`, data, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return res.status === 200;
//     } catch (error) {
//       console.log(error);
//       return false;
//     }
//   },
// };

// export default api;


import axios from "axios";

const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Common error-handling wrapper
async function handleRequest(promise) {
  try {
    const res = await promise;
    return { success: true, data: res.data };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error:
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        "An unexpected error occurred",
    };
  }
}

const api = {
  async getBoards(token) {
    return handleRequest(
      axios.get(`${BASE_URL}/custom/boards`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    );
  },

  async getBoard(id, token) {
    return handleRequest(
      axios.get(`${BASE_URL}/custom/boards/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    );
  },

  async createBoard(data, token) {
    return handleRequest(
      axios.post(`${BASE_URL}/custom/boards`, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
    );
  },

  async updateBoard(id, data, token) {
    return handleRequest(
      axios.put(`${BASE_URL}/custom/boards/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
    );
  },

  async deleteBoard(id, token) {
    return handleRequest(
      axios.delete(`${BASE_URL}/custom/boards/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    );
  },

  async createColumn(data, token) {
    return handleRequest(
      axios.post(`${BASE_URL}/custom/columns`, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
    );
  },

  async updateColumn(id, data, token) {
    return handleRequest(
      axios.put(`${BASE_URL}/custom/columns/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
    );
  },

  async deleteColumn(id, token) {
    return handleRequest(
      axios.delete(`${BASE_URL}/custom/columns/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    );
  },

  async createTask(data, token) {
    return handleRequest(
      axios.post(`${BASE_URL}/task-design/create`, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
    );
  },

  async updateTask(id, data, token) {
    return handleRequest(
      axios.put(`${BASE_URL}/task-design/update/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
    );
  },

  async deleteTask(id, token) {
    return handleRequest(
      axios.delete(`${BASE_URL}/task-design/remove/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    );
  },

  async moveTask(data, token) {
    return handleRequest(
      axios.put(`${BASE_URL}/task-design/move`, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
    );
  },
};

export default api;
