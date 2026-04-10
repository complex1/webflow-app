import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

interface WebFlowConfigAttributes {
  id: number;
  webFlowId: number;
  nodes: any[];
  edges: any[];
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface WebFlowConfigCreationAttributes extends Omit<WebFlowConfigAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class WebFlowConfig extends Model<WebFlowConfigAttributes, WebFlowConfigCreationAttributes> 
  implements WebFlowConfigAttributes {
  public id!: number;
  public webFlowId!: number;
  public nodes!: any[];
  public edges!: any[];
  public userId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

WebFlowConfig.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    webFlowId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'web_flows',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    nodes: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    edges: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'WebFlowConfig',
    tableName: 'WebFlowConfigs',
    timestamps: true,
  }
);

export default WebFlowConfig;
