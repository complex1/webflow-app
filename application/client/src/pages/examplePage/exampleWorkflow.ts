const ExampleData =  {
  "id": "27b05110-2b11-46c5-8b82-493b8ceda32d",
  "name": "example",
  "description": "",
  "tags": [],
  "icon": "pi pi-sitemap",
  "data": {
    "edges": [
      {
        "id": "63ab629f-06e2-43c4-9134-c51b96f5f5c5",
        "source": "cc1f8fab-13b7-4cd5-b50c-effc9019b5c9",
        "target": "c1ed3444-5706-4abc-af20-588a33d480b7",
        "sourceHandle": "cc1f8fab-13b7-4cd5-b50c-effc9019b5c9",
        "targetHandle": "c1ed3444-5706-4abc-af20-588a33d480b7"
      },
      {
        "id": "2724e96f-6254-4f88-9c42-ff3a105cc73c",
        "source": "cc1f8fab-13b7-4cd5-b50c-effc9019b5c9",
        "target": "c1ed3444-5706-4abc-af20-588a33d480b7",
        "sourceHandle": "data-cc1f8fab-13b7-4cd5-b50c-effc9019b5c9",
        "targetHandle": "var-b8b2c2a3-2acd-4823-8826-63dcaf4a99ff"
      },
      {
        "id": "b37dad81-9064-4c40-9879-16c523dedd41",
        "source": "2401a62c-7023-43fa-93f2-8b98df01c950",
        "target": "9e2bbf33-1383-4404-aaaf-b991d21fb416",
        "sourceHandle": "2401a62c-7023-43fa-93f2-8b98df01c950",
        "targetHandle": "9e2bbf33-1383-4404-aaaf-b991d21fb416"
      },
      {
        "id": "a65b84b3-bfb1-44e6-913a-ce0122ba2654",
        "source": "9e2bbf33-1383-4404-aaaf-b991d21fb416",
        "target": "4e135cd1-03da-4c83-a39e-8125a662efd6",
        "sourceHandle": "9e2bbf33-1383-4404-aaaf-b991d21fb416",
        "targetHandle": "4e135cd1-03da-4c83-a39e-8125a662efd6"
      },
      {
        "id": "d67c9e62-bb69-475a-bf87-47b8d82f90ba",
        "source": "9e2bbf33-1383-4404-aaaf-b991d21fb416",
        "target": "4e135cd1-03da-4c83-a39e-8125a662efd6",
        "sourceHandle": "data-9e2bbf33-1383-4404-aaaf-b991d21fb416",
        "targetHandle": "var-dea2b367-1e47-459f-9a3e-430d701990ce"
      },
      {
        "id": "d3e916a0-9034-4f49-95ef-9a5e84fe1c50",
        "source": "4e135cd1-03da-4c83-a39e-8125a662efd6",
        "target": "a28f4da5-2f7d-41c0-ae60-04c0d3bfdd14",
        "sourceHandle": "4e135cd1-03da-4c83-a39e-8125a662efd6",
        "targetHandle": "a28f4da5-2f7d-41c0-ae60-04c0d3bfdd14"
      },
      {
        "id": "95c3b390-296e-46b3-9cb2-9f4969eedcd1",
        "source": "4e135cd1-03da-4c83-a39e-8125a662efd6",
        "target": "a28f4da5-2f7d-41c0-ae60-04c0d3bfdd14",
        "sourceHandle": "data-4e135cd1-03da-4c83-a39e-8125a662efd6",
        "targetHandle": "var-c9ae1d66-b131-4dd7-89ad-9c2bd06bda79"
      },
      {
        "id": "71a664fb-26ea-48b4-9609-65bd4e115cea",
        "source": "c1ed3444-5706-4abc-af20-588a33d480b7",
        "target": "2401a62c-7023-43fa-93f2-8b98df01c950",
        "sourceHandle": "c1ed3444-5706-4abc-af20-588a33d480b7",
        "targetHandle": "2401a62c-7023-43fa-93f2-8b98df01c950"
      },
      {
        "id": "97676927-97a9-42af-9a22-3ac4394fc608",
        "source": "c1ed3444-5706-4abc-af20-588a33d480b7",
        "target": "2401a62c-7023-43fa-93f2-8b98df01c950",
        "sourceHandle": "data-c1ed3444-5706-4abc-af20-588a33d480b7",
        "targetHandle": "var-c79ae7b3-0be0-4ce8-bbd9-0f5d1daf0c02"
      },
      {
        "id": "4289ded0-470e-471c-9834-fec21897d824",
        "source": "c1ed3444-5706-4abc-af20-588a33d480b7",
        "target": "9e2bbf33-1383-4404-aaaf-b991d21fb416",
        "sourceHandle": "c1ed3444-5706-4abc-af20-588a33d480b7",
        "targetHandle": "9e2bbf33-1383-4404-aaaf-b991d21fb416"
      }
    ],
    "nodes": [
      {
        "id": "cc1f8fab-13b7-4cd5-b50c-effc9019b5c9",
        "type": "HTTP",
        "position": {
          "x": 44,
          "y": 159.125
        },
        "data": {
          "id": "cc1f8fab-13b7-4cd5-b50c-effc9019b5c9",
          "name": "User Registration",
          "description": "",
          "type": "HTTP",
          "order": 1,
          "baseUrl": "https://apiflux.in",
          "url": "/api/example/register",
          "pathParams": [],
          "queryParams": [],
          "headers": [],
          "body": {
            "id": "var-222fb2e3-41a4-410d-a62d-867014a8a46a",
            "name": "body",
            "description": "",
            "defaultValue": {
              "email": "jhon@dev.com",
              "name": "jhon dev",
              "password": "123456"
            },
            "type": "object",
            "formStore": true,
            "required": false
          },
          "method": "POST"
        }
      },
      {
        "id": "c1ed3444-5706-4abc-af20-588a33d480b7",
        "type": "FUNCTIONAL",
        "position": {
          "x": 523,
          "y": 166.75
        },
        "data": {
          "id": "c1ed3444-5706-4abc-af20-588a33d480b7",
          "name": "Get Token",
          "description": "",
          "type": "FUNCTIONAL",
          "order": 2,
          "parameters": [
            {
              "id": "var-b8b2c2a3-2acd-4823-8826-63dcaf4a99ff",
              "name": "res",
              "description": "",
              "defaultValue": null,
              "type": "string",
              "formStore": true,
              "required": false
            }
          ],
          "transform": "return {\n    token: res.data.token\n}"
        }
      },
      {
        "id": "9e2bbf33-1383-4404-aaaf-b991d21fb416",
        "type": "HTTP",
        "position": {
          "x": 1010.0986326913574,
          "y": 161.37967280028658
        },
        "data": {
          "id": "9e2bbf33-1383-4404-aaaf-b991d21fb416",
          "name": "User Login",
          "description": "",
          "type": "HTTP",
          "order": 3,
          "baseUrl": "https://apiflux.in",
          "url": "/api/example/login",
          "pathParams": [],
          "queryParams": [],
          "headers": [],
          "body": {
            "id": "var-ad36df87-8cde-426f-8f0e-705b44c07b33",
            "name": "body",
            "description": "",
            "defaultValue": {
              "email": "jhon@dev.com",
              "password": "123456"
            },
            "type": "object",
            "formStore": true,
            "required": false
          },
          "method": "POST"
        }
      },
      {
        "id": "a28f4da5-2f7d-41c0-ae60-04c0d3bfdd14",
        "type": "HTTP",
        "position": {
          "x": 2022.548228307331,
          "y": 159.3709791335363
        },
        "data": {
          "id": "a28f4da5-2f7d-41c0-ae60-04c0d3bfdd14",
          "name": "Get User",
          "description": "",
          "type": "HTTP",
          "order": 5,
          "baseUrl": "https://apiflux.in",
          "url": "/api/example/user",
          "pathParams": [],
          "queryParams": [],
          "headers": [
            {
              "id": "var-c9ae1d66-b131-4dd7-89ad-9c2bd06bda79",
              "name": "Authorization",
              "description": "",
              "defaultValue": null,
              "type": "string",
              "formStore": true,
              "required": false
            }
          ],
          "body": null,
          "method": "GET"
        }
      },
      {
        "id": "4e135cd1-03da-4c83-a39e-8125a662efd6",
        "type": "FUNCTIONAL",
        "position": {
          "x": 1502.2399301244275,
          "y": 172.0598483878587
        },
        "data": {
          "id": "4e135cd1-03da-4c83-a39e-8125a662efd6",
          "name": "Get header",
          "description": "",
          "type": "FUNCTIONAL",
          "order": 4,
          "parameters": [
            {
              "id": "var-dea2b367-1e47-459f-9a3e-430d701990ce",
              "name": "res",
              "description": "",
              "defaultValue": null,
              "type": "string",
              "formStore": true,
              "required": false
            }
          ],
          "transform": "return `bearer ${res.data.token}`"
        }
      }
    ]
  }
};
export default ExampleData;