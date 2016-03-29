package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strconv"
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
	TimeToSolve           string
	TimeToSolveSeconds    int
	ShowRightAnswer       bool
	ShowScoreOnlyAtTheEnd bool
}

var ServerConf ServerSettings
var ClientConf ClientSettings
var ClientConfJson []byte

func score(w http.ResponseWriter, r *http.Request) {
	file, err := ioutil.ReadFile("./scores.json")
	if err != nil {
		http.Error(w, "Can't read scores", http.StatusInternalServerError)
		return
	}

	var players []Player
	json.Unmarshal(file, &players)

	updated := false

	//если в конфиге
	if len(players) != ServerConf.ScoresCount {
		tmp := make([]Player, ServerConf.ScoresCount)
		copy(tmp, players)
		players = tmp
	}

	r.ParseForm()
	if len(r.Form) > 0 {
		score, err1 := strconv.Atoi(r.FormValue("score"))
		if err1 != nil || score < 0 || score > 100500 {
			http.Error(w, "Bad data", http.StatusInternalServerError)
			return
		}
		newPlayer := Player{r.FormValue("name"), score}

		for i, player := range players {
			if player.Score < score {
				log.Println("New record:", newPlayer)
				for j := 4; j >= i; j-- {
					if j > 0 {
						players[j] = players[j-1]
					}
				}
				players[i] = newPlayer
				updated = true
				break
			} else {
				log.Println("Player score:", newPlayer)
			}
		}
	}

	result, err4 := json.Marshal(players)
	if err4 != nil {
		http.Error(w, "Can't generate JSON", http.StatusInternalServerError)
		return
	}

	if updated {
		err5 := ioutil.WriteFile("./scores.json", result, 0644)
		if err5 != nil {
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
	log.Println("time to solve " + ClientConf.TimeToSolve)

	log.Fatal(http.ListenAndServe(":"+strconv.Itoa(ServerConf.Port), nil))

	log.Println("server started")
}
