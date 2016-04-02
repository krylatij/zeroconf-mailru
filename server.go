package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strconv"
	"html"
)

type Player struct {
	Name  string
	Score int
}

type ServerSettings struct {
	Port        int
	ScoresCount int
}

type ClientSettings struct {
	ScoresCount                      int
	TimeToSolve                      string
	TimeToSolveSeconds               int
	ShowRightAnswer                  bool
	ShowRightAnswerDelayMilliseconds int
	ShowScoreOnlyAtTheEnd            bool
}

var ServerConf ServerSettings
var ClientConf ClientSettings
var ClientConfJson []byte

func score(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()

	if len(r.Form) == 0 {
		http.Error(w, "Bad data. Form is empty.", http.StatusInternalServerError)
		return
	}
	score, err := strconv.Atoi(r.FormValue("score"))
	if err != nil || score < 0 || score > 100500 {
		http.Error(w, "Bad data. Incorrect score.", http.StatusInternalServerError)
		return
	}

	file, err := ioutil.ReadFile("./scores.json")
	if err != nil {
		log.Println("can't read scores %v", err)
		http.Error(w, "Can't read scores", http.StatusInternalServerError)
		return
	}

	var players []Player
	json.Unmarshal(file, &players)

	updated := false

	//обрежем рекорды, если поменяли настройку
	if len(players) > ServerConf.ScoresCount {
		players = players[:ServerConf.ScoresCount]
		updated = true
	}
	
	name := r.FormValue("name")
	if len(name) > 50{
		name = html.EscapeString(name[:50]) + "[truncated]"
	}

	newPlayer := Player{name, score}
	//когда записей ещё нет
	if len(players) == 0 {
		players = [1]Player{newPlayer}
		log.Println("new first record:", newPlayer)
	}
	else{
		for i, player := range players {
			if player.Score > newPlayer.Score {
				continue
			}
	
			log.Println("new record:", newPlayer)
			if i < MAX_COUNT-1 {
				players = append(players[:i], append([]Player{newPlayer}, players[i:]...)...)
			}
			players[i] = newPlayer
			updated = true
			break
		}
	}

	result, err := json.Marshal(players)
	if err != nil {
		log.Println("can't marshal scores %v", err)
		http.Error(w, "Can't generate JSON", http.StatusInternalServerError)
		return
	}

	if updated {
		err = ioutil.WriteFile("./scores.json", result, 0644)
		if err != nil {
			log.Println("can't write scores %v", err)
			http.Error(w, "Can't write scores", http.StatusInternalServerError)
			return
		}
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(result)
}

func config(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Write(ClientConfJson)
}

func read_settings() (ServerSettings, ClientSettings, []byte, error) {
	var serverConf ServerSettings
	var clientConf ClientSettings
	var clientConfJson []byte

	file, err := ioutil.ReadFile("settings.json")
	if err != nil {
		log.Println("can not read settings file.")
		return serverConf, clientConf, clientConfJson, err
	}

	err = json.Unmarshal(file, &serverConf)
	if err != nil {
		log.Println("can not read server settings from file.")
		return serverConf, clientConf, clientConfJson, err
	}

	err = json.Unmarshal(file, &clientConf)
	if err != nil {
		log.Println("can not read client settings from file.")
		return serverConf, clientConf, clientConfJson, err
	}

	clientConfJson, err = json.Marshal(clientConf)
	if err != nil {
		log.Println("can not convert client settings to json.")
		return serverConf, clientConf, clientConfJson, err
	}

	return serverConf, clientConf, clientConfJson, nil
}

func main() {
	f, err := os.OpenFile("server.log", os.O_RDWR|os.O_CREATE|os.O_APPEND, 0644)
	if err != nil {
		log.Fatalf("error opening file: %v", err)
	}
	defer f.Close()

	log.SetOutput(f)

	ServerConf, ClientConf, ClientConfJson, err = read_settings()

	if err != nil {
		log.Fatalf("error opening settings file: %v", err)
		return
	}

	http.HandleFunc("/score", score)
	http.HandleFunc("/config", config)
	http.Handle("/", http.FileServer(http.Dir("static")))

	log.Println("listening port " + strconv.Itoa(ServerConf.Port))

	log.Fatal(http.ListenAndServe(":"+strconv.Itoa(ServerConf.Port), nil))

	log.Println("server started")
}
