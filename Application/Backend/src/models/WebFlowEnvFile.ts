import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface WebFlowEnvFileAttributes {
  id: number;
  webFlowId: number;
  envFileId: number;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface WebFlowEnvFileCreationAttributes extends Optional<WebFlowEnvFileAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class WebFlowEnvFile extends Model<WebFlowEnvFileAttributes, WebFlowEnvFileCreationAttributes> implements WebFlowEnvFileAttributes {
  public id!: number;
  public webFlowId!: number;
  public envFileId!: number;
  public userId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

WebFlowEnvFile.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    webFlowId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'web_flow_id',
      references: {
        model: 'web_flows',
        key: 'id',
      },
    },
    envFileId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'env_file_id',
      references: {
        model: 'env_files',
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
    modelName: 'WebFlowEnvFile',
    tableName: 'web_flow_env_files',
    indexes: [
      {
        unique: true,
        fields: ['web_flow_id', 'env_file_id'],
      },
    ],
  }
);

// Associations will be defined in a separate file to avoid circular dependencies

export default WebFlowEnvFile;
