import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface EnvConfigAttributes {
  id: number;
  key: string;
  description: string;
  value: string;
  envFileId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface EnvConfigCreationAttributes extends Optional<EnvConfigAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class EnvConfig extends Model<EnvConfigAttributes, EnvConfigCreationAttributes> implements EnvConfigAttributes {
  public id!: number;
  public key!: string;
  public description!: string;
  public value!: string;
  public envFileId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

EnvConfig.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    key: {
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
    value: {
      type: DataTypes.TEXT,
      allowNull: false,
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
  },
  {
    sequelize,
    modelName: 'EnvConfig',
    tableName: 'env_configs',
  }
);

// Associations will be defined in a separate file to avoid circular dependencies

export default EnvConfig;
