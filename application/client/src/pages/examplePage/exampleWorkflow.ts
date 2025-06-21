const ExampleData =  {
  "id": "27b05110-2b11-46c5-8b82-493b8ceda32d",
  "name": "example",
  "description": "",
  "tags": [],
  "icon": "pi pi-sitemap",
  "data": {
    "edges": [
      {
        "id": "5e36e989-06b1-4152-aa05-a21573b44685",
        "source": "2401a62c-7023-43fa-93f2-8b98df01c950",
        "target": "9e2bbf33-1383-4404-aaaf-b991d21fb416",
        "sourceHandle": "2401a62c-7023-43fa-93f2-8b98df01c950",
        "targetHandle": "9e2bbf33-1383-4404-aaaf-b991d21fb416"
      },
      {
        "id": "a55e1a82-74d7-41de-b513-cfc9ee10e09a",
        "source": "9e2bbf33-1383-4404-aaaf-b991d21fb416",
        "target": "4e135cd1-03da-4c83-a39e-8125a662efd6",
        "sourceHandle": "9e2bbf33-1383-4404-aaaf-b991d21fb416",
        "targetHandle": "4e135cd1-03da-4c83-a39e-8125a662efd6"
      },
      {
        "id": "d3ec21f5-a54c-4c85-9f6f-f6ae8e100c69",
        "source": "4e135cd1-03da-4c83-a39e-8125a662efd6",
        "target": "a28f4da5-2f7d-41c0-ae60-04c0d3bfdd14",
        "sourceHandle": "4e135cd1-03da-4c83-a39e-8125a662efd6",
        "targetHandle": "a28f4da5-2f7d-41c0-ae60-04c0d3bfdd14"
      },
      {
        "id": "253830c7-46b9-47f3-b01b-f978fc8b772b",
        "source": "4e135cd1-03da-4c83-a39e-8125a662efd6",
        "target": "a28f4da5-2f7d-41c0-ae60-04c0d3bfdd14",
        "sourceHandle": "data-4e135cd1-03da-4c83-a39e-8125a662efd6",
        "targetHandle": "var-c9ae1d66-b131-4dd7-89ad-9c2bd06bda79"
      },
      {
        "id": "7508359f-dd59-4df7-a736-399529773d3e",
        "source": "c1ed3444-5706-4abc-af20-588a33d480b7",
        "target": "2401a62c-7023-43fa-93f2-8b98df01c950",
        "sourceHandle": "c1ed3444-5706-4abc-af20-588a33d480b7",
        "targetHandle": "2401a62c-7023-43fa-93f2-8b98df01c950"
      },
      {
        "id": "adc19f94-d476-4272-8115-0b5578b71a57",
        "source": "c1ed3444-5706-4abc-af20-588a33d480b7",
        "target": "2401a62c-7023-43fa-93f2-8b98df01c950",
        "sourceHandle": "data-c1ed3444-5706-4abc-af20-588a33d480b7",
        "targetHandle": "var-c79ae7b3-0be0-4ce8-bbd9-0f5d1daf0c02"
      },
      {
        "id": "29f1eedf-6c63-4325-b68c-f2dcae578657",
        "source": "cc1f8fab-13b7-4cd5-b50c-effc9019b5c9",
        "target": "9e2bbf33-1383-4404-aaaf-b991d21fb416",
        "sourceHandle": "cc1f8fab-13b7-4cd5-b50c-effc9019b5c9",
        "targetHandle": "9e2bbf33-1383-4404-aaaf-b991d21fb416"
      },
      {
        "id": "ce449296-0352-4dd5-96f7-9af43cc8865e",
        "source": "9e2bbf33-1383-4404-aaaf-b991d21fb416",
        "target": "4e135cd1-03da-4c83-a39e-8125a662efd6",
        "sourceHandle": "data-9e2bbf33-1383-4404-aaaf-b991d21fb416",
        "targetHandle": "var-dea2b367-1e47-459f-9a3e-430d701990ce"
      }
    ],
    "nodes": [
      {
        "id": "cc1f8fab-13b7-4cd5-b50c-effc9019b5c9",
        "type": "HTTP",
        "position": {
          "x": 101,
          "y": 55.125
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
            "id": "var-a6d5f086-0595-494b-8ddd-a802b2f7df7a",
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
        "id": "9e2bbf33-1383-4404-aaaf-b991d21fb416",
        "type": "HTTP",
        "position": {
          "x": 527.0986326913574,
          "y": 161.37967280028658
        },
        "data": {
          "id": "9e2bbf33-1383-4404-aaaf-b991d21fb416",
          "name": "User Login",
          "description": "",
          "type": "HTTP",
          "order": 2,
          "baseUrl": "https://apiflux.in",
          "url": "/api/example/login",
          "pathParams": [],
          "queryParams": [],
          "headers": [],
          "body": {
            "id": "var-2c5fd478-ad6a-4794-a89a-c45b9ff7259c",
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
          "x": 1390.548228307331,
          "y": 353.3709791335363
        },
        "data": {
          "id": "a28f4da5-2f7d-41c0-ae60-04c0d3bfdd14",
          "name": "Get User",
          "description": "",
          "type": "HTTP",
          "order": 4,
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
          "x": 961.2399301244275,
          "y": 272.05984838785866
        },
        "data": {
          "id": "4e135cd1-03da-4c83-a39e-8125a662efd6",
          "name": "Get header",
          "description": "",
          "type": "FUNCTIONAL",
          "order": 3,
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