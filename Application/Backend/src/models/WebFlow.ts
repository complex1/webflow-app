import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface WebFlowAttributes {
  id: number;
  name: string;
  description: string;
  icon: string;
  tags: string[];
  isFolder: boolean;
  hasOpenApiConfig: boolean;
  openApiConfigType?: 'SERVER' | 'FILE';
  openApiServerUrl?: string;
  openApiFileId?: number;
  hasPostmanCollection: boolean;
  postmanFileId?: number;
  basePath?: string;
  parentId?: number;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface WebFlowCreationAttributes extends Optional<WebFlowAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class WebFlow extends Model<WebFlowAttributes, WebFlowCreationAttributes> implements WebFlowAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public icon!: string;
  public tags!: string[];
  public isFolder!: boolean;
  public hasOpenApiConfig!: boolean;
  public openApiConfigType?: 'SERVER' | 'FILE';
  public openApiServerUrl?: string;
  public openApiFileId?: number;
  public hasPostmanCollection!: boolean;
  public postmanFileId?: number;
  public basePath?: string;
  public parentId?: number;
  public userId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

WebFlow.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 100],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'fas fa-folder',
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    isFolder: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    hasOpenApiConfig: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    openApiConfigType: {
      type: DataTypes.ENUM('SERVER', 'FILE'),
      allowNull: true,
    },
    openApiServerUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    openApiFileId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    hasPostmanCollection: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    postmanFileId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    basePath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'parent_id',
      references: {
        model: 'web_flows',
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'WebFlow',
    tableName: 'web_flows',
  }
);

// Associations will be defined in a separate file to avoid circular dependencies

export default WebFlow;
