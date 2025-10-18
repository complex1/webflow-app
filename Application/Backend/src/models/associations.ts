import User from './User';
import EnvFile from './EnvFile';
import EnvConfig from './EnvConfig';
import WebFlow from './WebFlow';
import WebFlowEnvFile from './WebFlowEnvFile';
import WebFlowConfig from './WebFlowConfig';
import File from './File';

// Define all model associations here to avoid circular dependencies

// User associations
User.hasMany(EnvFile, { foreignKey: 'userId', as: 'envFiles' });
User.hasMany(WebFlow, { foreignKey: 'userId', as: 'webFlows' });
User.hasMany(WebFlowConfig, { foreignKey: 'userId', as: 'webFlowConfigs' });
User.hasMany(File, { foreignKey: 'userId', as: 'files' });

// EnvFile associations
EnvFile.belongsTo(User, { foreignKey: 'userId', as: 'user' });
EnvFile.hasMany(EnvConfig, { foreignKey: 'envFileId', as: 'configs' });
EnvFile.belongsToMany(WebFlow, { 
  through: WebFlowEnvFile, 
  foreignKey: 'envFileId', 
  otherKey: 'webFlowId',
  as: 'webFlows' 
});

// EnvConfig associations
EnvConfig.belongsTo(EnvFile, { foreignKey: 'envFileId', as: 'envFile' });

// WebFlow associations
WebFlow.belongsTo(User, { foreignKey: 'userId', as: 'user' });
WebFlow.hasOne(WebFlowConfig, { foreignKey: 'webFlowId', as: 'config' });
WebFlow.belongsToMany(EnvFile, { 
  through: WebFlowEnvFile, 
  foreignKey: 'webFlowId', 
  otherKey: 'envFileId',
  as: 'envFiles' 
});

// Self-referencing associations for folder structure
WebFlow.hasMany(WebFlow, { foreignKey: 'parentId', as: 'children' });
WebFlow.belongsTo(WebFlow, { foreignKey: 'parentId', as: 'parent' });

// WebFlowConfig associations
WebFlowConfig.belongsTo(WebFlow, { foreignKey: 'webFlowId', as: 'webFlow' });
WebFlowConfig.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// WebFlowEnvFile associations (junction table)
WebFlowEnvFile.belongsTo(WebFlow, { foreignKey: 'webFlowId', as: 'webFlow' });
WebFlowEnvFile.belongsTo(EnvFile, { foreignKey: 'envFileId', as: 'envFile' });
User.hasMany(WebFlowEnvFile, { foreignKey: 'userId', as: 'webFlowEnvFiles' });
WebFlowEnvFile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// File associations
File.belongsTo(User, { foreignKey: 'userId', as: 'user' });
WebFlow.hasMany(File, { foreignKey: 'webFlowId', as: 'files' });
File.belongsTo(WebFlow, { foreignKey: 'webFlowId', as: 'webFlow' });

export {
  User,
  EnvFile,
  EnvConfig,
  WebFlow,
  WebFlowConfig,
  WebFlowEnvFile,
  File
};
