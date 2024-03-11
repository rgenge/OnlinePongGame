<template>
  <div class="ContainerBackground">
    <div class="JoinRoomcontainer">
      <h4>Waiting Player</h4>
      <div class="pongBall" style="background-color: #2cf718"></div>
      <div class="pongPaddle" style="background-color: #b9fdd5"></div>
      <div class="JoinRoomButton" @click="userCancelQueue">Back to Lobby</div>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { socket } from "./Pong.vue";
export default {
  name: "JoinRoom",
  methods: {
    userCancelQueue() {
      this.$router.push("lobby");
      socket.emit("cancelQueue");
      console.log("leave");
    },
  },
};
</script>
<style scoped>
.ContainerBackground {
  width: 100%;
  height: 100%;
  background-color: #363636;
  display: flex;
  justify-content: center;
  align-items: center;
}

.JoinRoomcontainer {
  width: 20em;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0.5rem;
  margin-top: 0.5rem;
  background: linear-gradient(112.85deg, #1a1a1a 0%, #d9d9d9 100%);
  border-radius: 1rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  font-size: 1.5rem;
  font-weight: bold;
  z-index: 999;
  color: white;
}

.JoinRoomcontainer h4 {
  font-size: 2rem;
  margin: 0;
  margin-top: 1rem;
  margin-bottom: 2rem;
  font-family: "spoopy";
}

.pongBall {
  position: absolute + 1px;
  width: 20px;
  height: 20px;
  background-color: #2cf718;
  border-radius: 50%;
  animation: bounceBall 0.5s infinite alternate;
}

.pongPaddle {
  position: absolute;
  width: 60px;
  height: 10px;
  background-color: #12f6f9;
}
</style>
