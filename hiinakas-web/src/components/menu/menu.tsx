import React, { useEffect, useState } from "react";
import styles from "./menu.module.scss";
import { useSpring, config, animated } from "react-spring";
import { RandomAvatar } from "react-random-avatars";
import { observer } from "mobx-react-lite";
import { useStore } from "@stores/stores";
import Select from "react-select";
import { Opponent, OpponentState } from "@stores/menu";

const MenuLogo = () => {
  return (
    <div id={styles.menuLogo}>
      <div id={styles.menuIcon}>
        <span>HIINAKAS</span>
      </div>
      <div id={styles.menuIconAlt}>
        <div></div>
        <span>CARD GAME</span>
      </div>
    </div>
  );
};

const MenuContent = () => {
  return (
    <div id={styles.menuContent}>
      <MenuContentSelf />
      <MenuContentOptions />
      <MenuContentPlayers />
      <MenuContentOpponents />
      <MenuContentFindMatch />
    </div>
  );
};

const MenuContentSelf = observer(() => {
  const { gameInstance } = useStore();

  return (
    <div id={styles.menuContentSelf}>
      <div id={styles.menuContentName}>{gameInstance.player.name}</div>
      <div id={styles.menuContentIcon}>
        <RandomAvatar name={gameInstance.player.publicUid} size={100} />
      </div>
    </div>
  );
});

const MenuContentOptions = () => {
  return (
    <div id={styles.menuContentOptions}>
      <div style={{color: "gray"}} id={styles.menuContentOptionsProfile}>PROFILE</div>
      <div style={{color: "gray"}} id={styles.menuContentOptionsSettings}>SETTINGS</div>
    </div>
  );
};

const MenuContentPlayers = observer(() => {
  const { menu } = useStore();
  return (
    <div id={styles.menuContentPlayers}>
      <div style={{color: "gray"}} onClick={() => menu.changeMaxPlayers(false)} id={styles.menuContentPlayersDown}>{"<"}</div>
      <div id={styles.menuContentPlayersLabel}>PLAYERS: 2</div>
      <div style={{color: "gray"}} onClick={() => menu.changeMaxPlayers(true)} id={styles.menuContentPlayersUp}>{">"}</div>
    </div>
  );
});

const MenuContentOpponents = observer(() => {
  const { menu } = useStore();

  return (
    <div id={styles.menuContentOpponent}>
      {menu.getOpponents().map((op) => {
        return (
          <React.Fragment key={op.uid}>
            {op.state === OpponentState.ADD && (
              <MenuContentOpponentAdd uid={op.uid} />
            )}
            {op.state === OpponentState.SEARCH && (
              <MenuContentOpponentAddSearch uid={op.uid} />
            )}
            {op.state === OpponentState.JOINED && (
              <MenuContentOpponent player={op} />
            )}
            {op.state === OpponentState.PENDING && (
              <MenuContentOpponentPending />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
});

const MenuContentFindMatch = observer(() => {
  const { menu } = useStore();
  return (
    <div
      onClick={() => (menu.isSelfOwner ? menu.findMatch() : menu.ready())}
      style={{
        borderTop: menu.isLobbyReady ? " 3px solid green" : "3px solid gray",
      }}
      id={styles.menuContentFindMatch}
    >
      {menu.isSelfOwner ? <span>FIND MATCH</span> : <span>READY</span>}
    </div>
  );
});

const MenuContentOpponent = ({ player }: { player: Opponent }) => {
  return (
    <div className={styles.menuContentOpponent}>
      <div className={styles.menuContentOpponentIcon}>
        <RandomAvatar name={player.user.uid} size={50} />
      </div>
      <div style={{ display: "grid", maxWidth: "180px", overflow: "hidden" }}>
        {player.user.name}
      </div>
    </div>
  );
};

const MenuContentOpponentAdd = observer(({ uid }: { uid: string }) => {
  const { menu } = useStore();
  return (
    <div
      onClick={() => {
        menu.updateOpponent(uid, OpponentState.SEARCH);
      }}
      className={styles.menuContentOpponentAdd}
    >
      <span>+ ADD PLAYER</span>
    </div>
  );
});

const customStyles = {
  option: (provided: any, _state: any) => ({
    ...provided,
    borderBottom: "1px dotted pink",
    color: "black",
    padding: 20,
  }),
};

const MenuContentOpponentAddSearch = observer(({ uid }: { uid: string }) => {
  const [selectedUser, setSelectedUser] = useState<string>(null);
  const { menu, gameInstance } = useStore();
  const usersSet = [...new Map(gameInstance.player.users?.map((user) => [user.uid, user])).values()];

  return (
    <div className={styles.menuContentOpponentAddWrapper}>
      <div className={styles.menuContentOpponentAddSearch}>
        <Select
          classNamePrefix="select"
          defaultValue={null}
          isSearchable={true}
          name="color"
          options={usersSet?.map((user) => {
            return { label: user.name, value: user.uid };
          })}
          onChange={(e) => {
            setSelectedUser(e.value);
          }}
          styles={customStyles}
        />
      </div>
      <div
        onClick={() => selectedUser && menu.requestUsers(selectedUser, uid)}
        className={styles.menuContentOpponentAddButton}
      >
        INVITE
      </div>
    </div>
  );
});

const MenuNotification = observer(() => {
  const { menu } = useStore();

  return (
    <div id={styles.menuNotification}>
      <div id={styles.menuNotificationWrapper}>
        <div id={styles.menuNotificationContent}>
          <div id={styles.menuNotificationText}>
            <span>Invited to game by: {menu.gameInvite?.senderPlayerUid}</span>
          </div>
          <div id={styles.menuNotificationButtons}>
            <div
              id={styles.menuNotificationAccept}
              onClick={() => menu.acceptGameInvite()}
            >
              ACCEPT
            </div>
            <div
              id={styles.menuNotificationDecline}
              onClick={() => menu.declineGameInvite()}
            >
              DECLINE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

const MenuGithubLogo = () => {
  return <div id={styles.menuGithubLogo}><a target="_blank" href="https://github.com/Somepub/Hiinakas"><img src="../github.svg" alt="GitHub" /></a></div>;
};

const MenuContentOpponentPending = observer(() => {
  return <div id={styles.menuContentOpponentPending}>Waiting response...</div>;
});

export const MainMenu = observer(() => {
  const { menu } = useStore();
  const [show, setShow] = useState(false);
  useEffect(() => setShow(true), []);

  const styleEffect = useSpring({
    config: config.gentle,
    from: { opacity: 0 },
    opacity: show ? 1 : 0,
    delay: 300,
  });

  return (
    <animated.div style={{...styleEffect}} id={styles.menu}>
      {menu.gameInvite?.uid && <MenuNotification />}
      <MenuLogo />
      <MenuContent />
      <MenuGithubLogo />
    </animated.div>
  );
});
