import React from "react";
import styles from "./front.module.scss";
import Card from "@components/card/card";
import { useStore } from "@stores/stores";
import { observer } from "mobx-react-lite";
import { BackCards } from "@components/card/backCards";
import { FloorCards } from "@components/card/floorCards";


export const Front = observer(() => {
  const store = useStore();
    return (
      <div id={styles.front}>
        <div id={styles.frontCards}>
          <BackCards cards={store.gameInstance.hand.hiddenCards} style={styles.hiddenCards}  />
          <FloorCards cards={store.gameInstance.hand.floorCards} style={styles.floorCards} />
        </div>
      </div>
    );
});