import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface FileAttributes {
  id: number;
  name: string;
  originalName: string;
  extension: string;
  size: number;
  url: string;
  fileName: string;
  mimetype?: string;
  webFlowId?: number;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface FileCreationAttributes extends Optional<FileAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class File extends Model<FileAttributes, FileCreationAttributes> implements FileAttributes {
  public id!: number;
  public name!: string;
  public originalName!: string;
  public extension!: string;
  public size!: number;
  public url!: string;
  public fileName!: string;
  public mimetype?: string;
  public webFlowId?: number;
  public userId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

File.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    originalName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    extension: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    size: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mimetype: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    webFlowId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'web_flow_id',
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
    modelName: 'File',
    tableName: 'files',
  }
);

// Associations will be defined in a separate file to avoid circular dependencies

export default File;
