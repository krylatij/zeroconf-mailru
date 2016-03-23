package main

import (
	"encoding/json"
	"fmt"
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

func score(w http.ResponseWriter, r *http.Request) {
	file, err := ioutil.ReadFile("./score.json")
	if err != nil {
		http.Error(w, "Can't read scores", http.StatusInternalServerError)
		return
	}

	var players []Player
	json.Unmarshal(file, &players)

	updated := false
	r.ParseForm()
	if len(r.Form) > 0 {
		score, err1 := strconv.Atoi(r.FormValue("score"))
		if err1 != nil || score < 0 || score > 10500 {
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
		err5 := ioutil.WriteFile("./score.json", result, 0644)
		if err5 != nil {
			http.Error(w, "Can't write scores", http.StatusInternalServerError)
			return
		}
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(result)
}

func main() {
	fmt.Println("hello world")
	//fmt.fmt.PrintLn('Hello world')

	f, err := os.OpenFile("server.log", os.O_RDWR|os.O_CREATE|os.O_APPEND, 0644)
	if err != nil {
		log.Fatalf("error opening file: %v", err)
	}
	defer f.Close()

	log.SetOutput(f)

	http.HandleFunc("/score", score)
	http.Handle("/", http.FileServer(http.Dir("static")))
	log.Fatal(http.ListenAndServe(":8081", nil))

}
