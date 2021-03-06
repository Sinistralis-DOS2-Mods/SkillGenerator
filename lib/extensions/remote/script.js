let varNames;
let remoteScript = 'EVENTS';

function getCoreScript() {
  return (`EVENTS
  
EVENT ${varNames.bridgeEventName}
VARS
  CHARACTER: _Source
  CHARACTER: _Target
  INT: _Level
  INT: _IsSingleTarget
  FLOAT3: _ExplodeLoc
  FLOAT: _ExplodeY
  STRING: _Status
  SKILL: _DamageSkill

ON
  OnCharacterCharacterEvent(_Source, _Target, "${varNames.bridgeEventName}")
ACTIONS
  IF "c1&c2&c3&c4&c5"
    GetVar(_Status, _Source, "${varNames.statusVarName}")
    GetVar(_IsSingleTarget, _Source, "${varNames.isSingleTargetVarName}")
    GetLevelOverrideCurrent(_Source, _Level)
    GetPosition(_Target, _ExplodeLoc)
    GetY(_ExplodeLoc, _ExplodeY)
  THEN
    CharacterEvent(_Source, _Status)
    IF "c1"
      GetVar(_DamageSkill, _Source, "${varNames.damageSkillVarName}")
    THEN
      IF "c1"
        IsEqual(_IsSingleTarget, 1)
      THEN
        Add(_ExplodeY, 2.75)
        SetY(_ExplodeLoc, _ExplodeY)
      ENDIF
      ExplodeAt(_ExplodeLoc, _DamageSkill, _Level, _Source)
    ENDIF
  ENDIF
    `);
}

function addRemote(status, remote) {
  remoteScript += (`
EVENT ${status}
VARS
  CHARACTER:_Source
  SKILL: _DamageSkill
  
ON
  OnCharacterEvent(_Source, "${status}")
ACTIONS
  Set(_DamageSkill, Projectile_${remote})
  SetVar(_Source, "${varNames.damageSkillVarName}", _DamageSkill)`);
}

function getRemoteScript() {
  return remoteScript;
}

function init(_statNames, _varNames) {
  varNames = _varNames;
}

module.exports = {
  init,
  addRemote,
  getRemoteScript,
  getCoreScript,
};
