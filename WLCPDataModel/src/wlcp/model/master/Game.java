package wlcp.model.master;

import java.io.Serializable;
import javax.persistence.*;

/**
 * Entity implementation class for Entity: Game
 *
 */
@Entity
@Table(name = "GAME")
public class Game implements Serializable {

	
	private static final long serialVersionUID = 1L;
	
	@Id
	@Column(length = 40, name = "GAME_NAME")
	private String gameName;

	@Column(name = "TEAM_COUNT")
	private Integer teamCount;
	
	@Column(name = "PLAYERS_PER_TEAM")
	private Integer playersPerTeam;
	
	@ManyToOne(cascade = CascadeType.PERSIST)
	@JoinColumn(name = "USERNAME", nullable = false)
	private Username username;
	
	@Column(name = "VISIBILITY")
	private Boolean visibility;

	public Game() {
		super();
	}

	public Game(String gameName, Integer teamCount, Integer playersPerTeam, Username username,
			Boolean visibility) {
		super();
		this.gameName = gameName;
		this.teamCount = teamCount;
		this.playersPerTeam = playersPerTeam;
		this.username = username;
		this.visibility = visibility;
	}

	public String getGameName() {
		return gameName;
	}

	public void setGameName(String gameName) {
		this.gameName = gameName;
	}

	public Integer getTeamCount() {
		return teamCount;
	}

	public void setTeamCount(Integer teamCount) {
		this.teamCount = teamCount;
	}

	public Integer getPlayersPerTeam() {
		return playersPerTeam;
	}

	public void setPlayersPerTeam(Integer playersPerTeam) {
		this.playersPerTeam = playersPerTeam;
	}

	public Username getUsername() {
		return username;
	}

	public void setUsername(Username username) {
		this.username = username;
	}

	public Boolean getVisibility() {
		return visibility;
	}

	public void setVisibility(Boolean visibility) {
		this.visibility = visibility;
	}
	
}
