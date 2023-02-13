import server from "@/plugins/axiosMiddleware";

export class FakeApiService {
  controller: string;
  response: any;
  requestCaller:string;
  apiCall:boolean;
  constructor(controller: string) {
    this.controller = controller + "/";
    this.apiCall = import.meta.env.VITE_SVELTE_APP_MAKE_FAKE_API == "true";
  }
  protected setResponse(key,responseData){
    this.requestCaller = key;
    this.response = responseData;
  }
  protected getResponse(){
    let response = this.response,
    callerName = this.requestCaller;
    this.response = null;
    this.requestCaller = null;
    return {response,callerName}
  }
  private async wait(time){
     return new Promise(res => {
         setTimeout(res,time)
     })
  }
  protected async getAll(method = "GetAll", headers?: any): Promise<any> {
    let {response,callerName} = this.getResponse();

    if(!this.apiCall){

      await this.wait(500);
      console.log('req:' + this.controller + `${method}` + `  ${callerName}`,response)
      return response;

    }
   
    return new Promise((resolve, reject) => {
      server
        .get(this.controller + `${method}`, {
          headers,
        })
        .then((response) => {
          if (response.status === 204) {
            // Not found
            resolve([]);
          } else {
            resolve(response.data);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  protected async get(method: string, id = "", headers?: any): Promise<any> {
    let {response,callerName} = this.getResponse();

    if (id) {
      method += "/" + id;
    }


    if(!this.apiCall){

      await this.wait(500);
      console.log('req:' + this.controller + `${method}` + `  ${callerName}`,response)
      return response;

    }

    return new Promise((resolve, reject) => {
      server
        .get(this.controller + method, {
          headers,
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });

   
  }
  protected async post(data: any, method = "Create", headers?: any): Promise<any> {
    let {response,callerName} = this.getResponse();

    if(!this.apiCall){

      await this.wait(500);
      console.log('req:' + this.controller + `${method}` + `  ${callerName}`,response)
      return response;

    }

    return new Promise((resolve, reject) => {
      server
        .post(this.controller + `${method}`, data, {
          headers,
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });

  }
  protected async download(
    data: any,
    method = "Download",
    headers?: any
  ): Promise<any> {

    let {response,callerName} = this.getResponse();

    if(!this.apiCall){

      await this.wait(500);
      console.log('req:' + this.controller + `${method}` + `  ${callerName}`,response)
      return response;

    }

    return new Promise((resolve, reject) => {
      server
        .post(this.controller + `${method}`, data, {
          responseType: "blob",
          headers,
        })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });

  }
  protected async upload(fileData: FormData, method = "Upload"): Promise<any> {
    let {response,callerName} = this.getResponse();

    return new Promise((resolve, reject) => {
      server
        .post(this.controller + `${method}`, fileData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  protected async put(
    id: string,
    data: any,
    method = "Update",
    headers?: any
  ): Promise<any> {
    let {response,callerName} = this.getResponse();

    if(!this.apiCall){

      await this.wait(500);
      console.log('req:' + this.controller + `${method}` + `  ${callerName}`,response)
      return response;

    }

    return new Promise((resolve, reject) => {
      server
        .put(this.controller + `${method}/${id}`, data, {
          headers,
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });


  }
  protected async delete(id: string, method = "Delete", headers?: any): Promise<any> {
    let {response,callerName} = this.getResponse();

    if (id) {
      method += "/" + id;
    }

    if(!this.apiCall){

      await this.wait(500);
      console.log('req:' + this.controller + `${method}` + `  ${callerName}`,response)
      return response;

    }

    return new Promise((resolve, reject) => {
      server
        .delete(this.controller + `${method}`, {
          headers,
        })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
    
  }
}
