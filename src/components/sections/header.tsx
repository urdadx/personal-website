export function Header() {
	return (
		<header className="mb-16">
			<div className="w-full md:flex md:items-center md:justify-between">
				<div className="md:flex md:flex-col md:justify-center">
					<div className="flex items-center gap-3 mb-5">
						<img
							className="w-12 h-12 rounded-full"
							src="/images/blob.avif"
							alt="Abdul Wahab Abass"
						/>
						<div className="flex flex-col gap-1">
							<h1
								className="text-2xl font-light"
								style={{ fontFamily: "Crimson Pro, serif" }}>
								Abdul Wahab Abass
							</h1>
							<p className="text-sm text-muted-foreground ">
								Software Engineer{" "}
							</p>
						</div>
					</div>
					<p
						className="text-base text-muted-foreground leading-loose"
						style={{ fontFamily: "Inter, sans-serif" }}>
						I'm a software engineer focused on crafting thoughtful digital
						experiences, creating tools that feel calm, tactile, and
						purposeful. Outside coding, I enjoy watching Formula 1 and
						football.
					</p>
				</div>
			</div>
		</header>
	);
}
