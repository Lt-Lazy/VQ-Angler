<?xml version="1.0" encoding="UTF-8"?>
<tileset version="1.10" tiledversion="1.11.2" name="game-tiles" tilewidth="32" tileheight="32" tilecount="6" columns="0">
 <grid orientation="orthogonal" width="1" height="1"/>
 <tile id="1">
  <properties>
   <property name="kind" value="ground"/>
   <property name="texture" value="grass02"/>
  </properties>
  <image source="grass02.png" width="32" height="32"/>
 </tile>
 <tile id="2">
  <properties>
   <property name="texture" value="mud"/>
  </properties>
  <image source="mud.png" width="32" height="32"/>
 </tile>
 <tile id="3">
  <properties>
   <property name="kind" value="ground"/>
   <property name="solid" value="true"/>
   <property name="texture" value="water-waves"/>
  </properties>
  <image source="water-waves.png" width="32" height="32"/>
 </tile>
 <tile id="5">
  <properties>
   <property name="kind" value="object"/>
   <property name="texture" value="tree"/>
  </properties>
  <image source="tree.png" width="32" height="32"/>
 </tile>
 <tile id="6">
  <properties>
   <property name="texture" value="blackwall"/>
  </properties>
  <image source="blackwall.png" width="32" height="32"/>
 </tile>
 <tile id="12">
  <properties>
   <property name="height" value="45"/>
   <property name="kind" value="wall"/>
   <property name="solid" value="true"/>
   <property name="texture" value="house/plank-wall-window32x96"/>
  </properties>
  <image source="house/plank-wall.png" width="32" height="32"/>
 </tile>
</tileset>
